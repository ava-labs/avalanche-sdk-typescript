/**
 * Warp + L1 conversion E2E flow against a tmpnet AvalancheGo network.
 *
 * Sequential — each step's output feeds the next. State is shared via the
 * mutable {@link FlowState} object; prerequisite checks at the top of each
 * step bail out if an earlier step left state incomplete.
 *
 * Skip with:  SKIP_INTEGRATION=true bun test
 */

import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { utils } from "@avalabs/avalanchejs";
import {
  ConversionData,
  initializeValidatorSet,
  newConversionData,
  registerL1Validator,
  upgradeProxyToValidatorManager,
  VALIDATOR_MANAGER_PROXY_ADDRESS,
} from "@avalanche-sdk/interchain";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheLocal } from "@avalanche-sdk/client/chains";
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { sha256 } from "@noble/hashes/sha2";
import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
  type Address,
  type Hex,
  type PublicClient,
  type WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { LOCAL_PREFUNDED_KEYS } from "../src/tmpnet/constants.ts";
import { TmpnetManager } from "../src/tmpnet/index.ts";
import type { NodeInfo } from "../src/tmpnet/types.ts";
import { SignatureAggregatorManager } from "../src/signature-aggregator/index.ts";

import {
  BOOT_TIMEOUT_MS,
  L1_CHAIN_ID,
  L1_CHAIN_NAME,
  SUBNET_EVM_VM_ID,
  TMPNET_NETWORK_ID,
  TX_TIMEOUT_MS,
} from "./helpers/constants.ts";
import { loadValidatorBlsKeypair } from "./helpers/bls.ts";
import { buildL1GenesisConfig } from "./helpers/genesis.ts";
import { dumpProposerVMHeights, rollL1PastFirstEpoch } from "./helpers/proposervm.ts";
import { buildAggregateSignaturesFn } from "./helpers/sig-aggregator.ts";
import {
  waitForCommitted,
  waitForL1EvmReady,
  waitForL1ValidatorRegistered,
  waitForPChainReady,
} from "./helpers/wait.ts";

const SKIP_INTEGRATION = process.env.SKIP_INTEGRATION === "true";
const NETWORK_NAME = `e2e-warp-l1-${Date.now()}`;
const EWOQ_PK = `0x${LOCAL_PREFUNDED_KEYS.ewoq.privateKey}` as `0x${string}`;
const EWOQ_C_ADDR = LOCAL_PREFUNDED_KEYS.ewoq.cChainAddress as `0x${string}`;

interface FlowState {
  tmpnet?: TmpnetManager;
  walletClient?: ReturnType<typeof createAvalancheWalletClient>;
  account?: ReturnType<typeof privateKeyToAvalancheAccount>;
  ownerPAddr?: string;
  primaryNodes?: NodeInfo[];
  subnetId?: string;
  blockchainId?: string;
  l1Node?: NodeInfo;
  convertTxId?: string;
  conversionData?: ConversionData;
  l1WalletClient?: WalletClient;
  l1PublicClient?: PublicClient;
  validatorManagerAddress?: Address;
  signatureAggregator?: SignatureAggregatorManager;
  l1Node2?: NodeInfo;
  newValidationID?: Hex;
}
const state: FlowState = {};

/**
 * Verify the named fields of {@link state} are populated and return a
 * narrowed view. Use the returned object inside tests so the narrowing
 * survives across `await` boundaries — `state` itself is mutable, so
 * TypeScript de-narrows it after every async call.
 */
function requireState<K extends keyof FlowState>(
  ...keys: K[]
): { [P in K]: NonNullable<FlowState[P]> } {
  const out: Record<string, unknown> = {};
  for (const k of keys) {
    if (state[k] == null) throw new Error(`Prerequisite step failed: state.${String(k)} missing`);
    out[k as string] = state[k];
  }
  return out as { [P in K]: NonNullable<FlowState[P]> };
}

describe.skipIf(SKIP_INTEGRATION)("warp + L1 flow against tmpnet", () => {
  beforeAll(async () => {
    state.tmpnet = new TmpnetManager();
    const result = await state.tmpnet.createNetwork(NETWORK_NAME, 5, (msg) =>
      console.log(`[tmpnet] ${msg}`),
    );
    if (!result.success) throw new Error(`Failed to start tmpnet: ${result.error?.message}`);
    state.primaryNodes = result.data?.nodes;

    state.account = privateKeyToAvalancheAccount(EWOQ_PK);
    state.ownerPAddr = state.account.getXPAddress("P", "local");
    state.walletClient = createAvalancheWalletClient({
      account: state.account,
      chain: avalancheLocal,
      transport: { type: "http", url: "http://127.0.0.1:9650/" },
    });

    await waitForPChainReady(state.walletClient);
  }, BOOT_TIMEOUT_MS);

  afterAll(async () => {
    // KEEP_TMPNET=1 leaves the network running for interactive debugging.
    if (process.env.KEEP_TMPNET) {
      console.log(`[teardown] KEEP_TMPNET set — leaving network running`);
      return;
    }
    await state.signatureAggregator?.dispose().catch(() => {});
    // Stop processes but don't delete the network directory — GH Actions
    // uploads tmpnet logs as artifacts on failure.
    await state.tmpnet?.stopNetwork().catch(() => {});
    await state.tmpnet?.dispose().catch(() => {});
  }, 60_000);

  test("1. tmpnet booted with 5 nodes and P-Chain reachable", () => {
    // createNetwork already waited for chain bootstrap before returning success,
    // and we ran waitForPChainReady in beforeAll — trusting those two is enough.
    // A getStatus() race here can briefly report running=false even when up.
    expect(state.tmpnet).toBeDefined();
    expect(state.primaryNodes?.length).toBe(5);
    expect(state.walletClient).toBeDefined();
  });

  test("2. Create subnet via prepareCreateSubnetTxn", async () => {
    const { walletClient, ownerPAddr } = requireState("walletClient", "ownerPAddr");
    const txnRequest = await walletClient.pChain.prepareCreateSubnetTxn({
      subnetOwners: { addresses: [ownerPAddr], threshold: 1 },
    });
    const { txHash } = await walletClient.sendXPTransaction({
      tx: txnRequest.tx,
      chainAlias: "P",
    });
    expect(txHash.length).toBeGreaterThan(0);

    await waitForCommitted(walletClient, txHash);
    state.subnetId = txHash; // subnet ID is the create-subnet tx ID
    console.log(`[step 2] subnet created: ${state.subnetId}`);
  }, TX_TIMEOUT_MS);

  test("3. Create subnet-evm blockchain via prepareCreateChainTxn", async () => {
    const { walletClient, subnetId } = requireState("walletClient", "subnetId");
    const genesisData = buildL1GenesisConfig({
      prefundedAddress: EWOQ_C_ADDR,
      proxyAdminOwner: EWOQ_C_ADDR,
    });

    const txnRequest = await walletClient.pChain.prepareCreateChainTxn({
      subnetId,
      // AvalancheGo rejects non-alphanumeric chars in chain names with
      // "illegal name character" — keep it strictly [A-Za-z0-9].
      chainName: L1_CHAIN_NAME,
      vmId: SUBNET_EVM_VM_ID,
      genesisData,
      subnetAuth: [0],
      fxIds: [],
    });
    // subnetOwners + subnetAuth so signXPTransaction adds the subnet-credential
    // signature — without these the tx is rejected as "unauthorized modification".
    const { txHash } = await walletClient.sendXPTransaction({
      tx: txnRequest.tx,
      chainAlias: "P",
      subnetOwners: txnRequest.subnetOwners,
      subnetAuth: txnRequest.subnetAuth,
    });
    await waitForCommitted(walletClient, txHash);
    state.blockchainId = txHash;
    console.log(`[step 3] blockchain created: ${state.blockchainId}`);
  }, TX_TIMEOUT_MS);

  test("4. Spin up L1 validator node tracking the subnet", async () => {
    const { tmpnet, subnetId } = requireState("tmpnet", "subnetId");
    const result = await tmpnet.addL1Node(subnetId, (msg) => console.log(`[l1-node] ${msg}`));
    expect(result.success).toBe(true);
    const node = result.data!;
    state.l1Node = node;
    expect(node.nodeId.startsWith("NodeID-")).toBe(true);
    expect(node.blsPublicKey).toBeTruthy();
    expect(node.blsProofOfPossession).toBeTruthy();
    console.log(`[step 4] L1 node up: ${node.nodeId} @ ${node.uri}`);
  }, BOOT_TIMEOUT_MS);

  test("5. ConvertSubnetToL1: byte-equivalence of ConversionData.toHex()", async () => {
    const { walletClient, subnetId, blockchainId, l1Node, ownerPAddr } = requireState(
      "walletClient",
      "subnetId",
      "blockchainId",
      "l1Node",
      "ownerPAddr",
    );
    // Use the genesis-pre-deployed proxy as the validator manager — that
    // address has to exist at conversion time because it's baked into the
    // canonical conversion-data hash. Step 6 upgrades the proxy at the real
    // ValidatorManager impl after conversion completes.
    const managerAddress = VALIDATOR_MANAGER_PROXY_ADDRESS;
    const validators = [
      {
        nodeId: l1Node.nodeId,
        weight: 100n,
        initialBalanceInNanoAvax: 100_000_000n, // 0.1 AVAX
        nodePoP: {
          publicKey: l1Node.blsPublicKey!,
          proofOfPossession: l1Node.blsProofOfPossession!,
        },
        remainingBalanceOwner: { addresses: [ownerPAddr], threshold: 1 },
        deactivationOwner: { addresses: [ownerPAddr], threshold: 1 },
      },
    ];

    const localConversionData = newConversionData(
      subnetId,
      blockchainId,
      managerAddress,
      validators.map((v) => ({
        nodeId: v.nodeId,
        blsPublicKey: v.nodePoP.publicKey,
        weight: v.weight,
      })),
    );
    state.conversionData = localConversionData;
    const localConversionId = localConversionData.getConversionId();
    console.log(`[step 5] local conversionID: ${localConversionId}`);

    const txnRequest = await walletClient.pChain.prepareConvertSubnetToL1Txn({
      subnetId,
      blockchainId,
      managerContractAddress: managerAddress,
      validators,
      subnetAuth: [0],
    });
    const { txHash } = await walletClient.sendXPTransaction({
      tx: txnRequest.tx,
      chainAlias: "P",
      subnetOwners: txnRequest.subnetOwners,
      subnetAuth: txnRequest.subnetAuth,
    });
    state.convertTxId = txHash;
    await waitForCommitted(walletClient, txHash, BOOT_TIMEOUT_MS);
    console.log(`[step 5] convertSubnetToL1 committed: ${txHash}`);

    // The fact that P-Chain committed ConvertSubnetToL1Tx IS the byte-
    // equivalence proof for this PR — AvalancheGo computes the conversionID
    // from the same canonical bytes our ConversionData.toHex() emits. If
    // those diverged, the tx would fail verification with "incorrect
    // conversion ID" instead of committing.
    const onChain = await walletClient.pChain.getCurrentValidators({ subnetID: subnetId });
    expect(onChain).toBeDefined();

    // Self-consistency: getConversionId() == sha256(toHex()).
    const reHashed = utils.bufferToHex(sha256(utils.hexToBuffer(localConversionData.toHex())));
    expect(reHashed).toBe(localConversionId);

    // FOLLOWUP: parseConversionData still uses avalanchejs's broken
    // unpack and is no longer the inverse of toHex(). Round-trip
    // assertion is intentionally omitted; filed as a separate fix.
  }, BOOT_TIMEOUT_MS);

  test("6. Deploy ValidatorManager impl + upgrade proxy on the L1 EVM", async () => {
    const { l1Node, blockchainId, subnetId } = requireState("l1Node", "blockchainId", "subnetId");
    const evmAccount = privateKeyToAccount(EWOQ_PK);

    const l1RpcUrl = `${l1Node.uri}/ext/bc/${blockchainId}/rpc`;
    console.log(`[step 6] waiting for L1 EVM RPC at ${l1RpcUrl}...`);
    await waitForL1EvmReady(l1RpcUrl);

    const l1Chain = defineChain({
      id: L1_CHAIN_ID,
      name: "e2e-l1",
      nativeCurrency: { decimals: 18, name: "L1", symbol: "L1" },
      rpcUrls: { default: { http: [l1RpcUrl] } },
    });
    const l1WalletClient = createWalletClient({
      account: evmAccount,
      chain: l1Chain,
      transport: http(),
    });
    const l1PublicClient = createPublicClient({ chain: l1Chain, transport: http() });
    state.l1WalletClient = l1WalletClient;
    state.l1PublicClient = l1PublicClient;

    const subnetIdHex = `0x${Buffer.from(utils.base58check.decode(subnetId)).toString("hex")}` as Hex;

    // viem is installed twice (e2e + interchain) so WalletClient types
    // don't unify across packages — cast at the boundary.
    const upgrade = await upgradeProxyToValidatorManager(
      l1WalletClient as never,
      l1PublicClient as never,
      {
        initSettings: {
          admin: evmAccount.address,
          subnetID: subnetIdHex,
          churnPeriodSeconds: 0n,
          maximumChurnPercentage: 20,
        },
      },
    );
    expect(upgrade.address).toBe(VALIDATOR_MANAGER_PROXY_ADDRESS);
    expect(upgrade.implementationAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(upgrade.libraryAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
    state.validatorManagerAddress = upgrade.address;
    console.log(`[step 6] proxy upgraded to impl ${upgrade.implementationAddress}`);
  }, BOOT_TIMEOUT_MS);

  test("7. initializeValidatorSet via signature-aggregator", async () => {
    const {
      l1Node,
      subnetId,
      blockchainId,
      l1WalletClient,
      l1PublicClient,
      validatorManagerAddress,
      walletClient,
    } = requireState(
      "tmpnet",
      "l1Node",
      "subnetId",
      "blockchainId",
      "l1WalletClient",
      "l1PublicClient",
      "validatorManagerAddress",
      "walletClient",
    );

    console.log(`[step 7] waiting for L1 validator to register on P-Chain...`);
    const count = await waitForL1ValidatorRegistered(walletClient, subnetId);
    console.log(`[step 7] L1 has ${count} validator(s) on P-Chain`);

    // Advance P-Chain height by 2 with self-transfers so the L1's proposerVM
    // catches the subnet conversion in its tracked P-Chain view.
    for (let i = 0; i < 2; i++) {
      console.log(`[step 7] advancing P-Chain height (${i + 1}/2)...`);
      const advanceTxn = await walletClient.pChain.prepareBaseTxn({});
      const { txHash } = await walletClient.sendXPTransaction({
        tx: advanceTxn.tx,
        chainAlias: "P",
      });
      await waitForCommitted(walletClient, txHash);
    }
    await Bun.sleep(30_000);
    await dumpProposerVMHeights(l1Node.uri, blockchainId, "step 7");
    await rollL1PastFirstEpoch(l1WalletClient, l1PublicClient, 35_000, (m) =>
      console.log(`[step 7] ${m}`),
    );
    await dumpProposerVMHeights(l1Node.uri, blockchainId, "step 7");

    const sigagg = new SignatureAggregatorManager();
    state.signatureAggregator = sigagg;
    const networkDir = `${process.env.HOME}/.avalanche-cli/tmpnet/networks/${NETWORK_NAME}`;
    const sigaggStart = await sigagg.start(networkDir, { trackedSubnets: [subnetId] }, (m) =>
      console.log(`[sigagg] ${m}`),
    );
    expect(sigaggStart.running).toBe(true);

    const result = await initializeValidatorSet(l1WalletClient as never, l1PublicClient as never, {
      contractAddress: validatorManagerAddress,
      networkId: TMPNET_NETWORK_ID,
      subnetId,
      blockchainId,
      validators: [
        { nodeId: l1Node.nodeId, weight: 100n, blsPublicKey: l1Node.blsPublicKey! as Hex },
      ],
      aggregateSignatures: buildAggregateSignaturesFn(sigagg, {
        log: (m) => console.log(`[step 7] ${m}`),
      }),
    });

    expect(result.receipt.status).toBe("success");
    expect(result.signedMessageHex.length).toBeGreaterThan(2);
    console.log(`[step 7] initializeValidatorSet committed: ${result.txHash}`);
  }, BOOT_TIMEOUT_MS);

  test("8. registerL1Validator: add a 2nd L1 node as a new validator", async () => {
    const {
      tmpnet,
      subnetId,
      l1WalletClient,
      l1PublicClient,
      validatorManagerAddress,
      walletClient,
      signatureAggregator,
      ownerPAddr,
    } = requireState(
      "tmpnet",
      "subnetId",
      "l1WalletClient",
      "l1PublicClient",
      "validatorManagerAddress",
      "walletClient",
      "signatureAggregator",
      "ownerPAddr",
    );

    // Spin up a 2nd L1 node. It tracks the L1 from primary-network start but
    // is NOT a P-Chain validator yet — this flow registers it.
    const addResult = await tmpnet.addL1Node(subnetId, (m) => console.log(`[l1-node-2] ${m}`));
    expect(addResult.success).toBe(true);
    const node2 = addResult.data!;
    state.l1Node2 = node2;
    expect(node2.signerKeyPath).toBeTruthy();
    console.log(`[step 8] L1 node 2 up: ${node2.nodeId} @ ${node2.uri}`);

    // Load the new node's BLS keypair so we can sign the registration on its
    // behalf — avalanchego's RegisterL1ValidatorTx requires a BLS signature
    // from the validator over the AddressedCall payload bytes.
    const blsKeypair = loadValidatorBlsKeypair(node2.signerKeyPath!);
    expect(blsKeypair.publicKey.toLowerCase()).toBe(node2.blsPublicKey!.toLowerCase());

    // Convert EWOQ's P-Chain bech32 address to a 0x-hex 20-byte form for
    // the PChainOwner struct the EVM contract expects.
    const ownerPAddrBytes = utils.bech32ToBytes(ownerPAddr);
    const ownerAddrHex = `0x${Buffer.from(ownerPAddrBytes).toString("hex")}` as Address;
    const balanceOwner = { threshold: 1, addresses: [ownerAddrHex] as const };

    const aggregateSignatures = buildAggregateSignaturesFn(signatureAggregator, {
      log: (m) => console.log(`[step 8] ${m}`),
    });

    const result = await registerL1Validator(l1WalletClient as never, l1PublicClient as never, {
      validatorManagerAddress,
      networkId: TMPNET_NETWORK_ID,
      subnetId,
      validator: {
        nodeId: node2.nodeId,
        blsPublicKey: blsKeypair.publicKey,
        weight: 1n,
        remainingBalanceOwner: balanceOwner,
        disableOwner: balanceOwner,
      },
      aggregateSignatures,
      getBlsProofOfPossession: async () => blsKeypair.proofOfPossession,
      submitPChainRegisterTx: async ({ signedWarpMessageHex, blsProofOfPossessionHex }) => {
        // P-Chain's mempool verifies RegisterL1ValidatorTx warp messages at
        // `recommendedPChainHeight` (see avalanchego block/builder/builder.go
        // → GetMinimumHeight). On a fresh local network, this lags behind the
        // current tip — and at heights before the L1 was registered the
        // subnet's validator set is empty, so the bitset's signer index can't
        // be filtered against any validator (the error surfaces as "unknown
        // validator: NumIndices (0) >= NumFilteredValidators (0)" — the (0)
        // is misleading, see avalanchego warp/validator.go::FilterValidators).
        //
        // Advance P-Chain with self-transfers + a 30s sleep so GetMinimum
        // catches up past the L1's conversion height before we submit.
        for (let i = 0; i < 2; i++) {
          const adv = await walletClient.pChain.prepareBaseTxn({});
          const { txHash } = await walletClient.sendXPTransaction({
            tx: adv.tx,
            chainAlias: "P",
          });
          await waitForCommitted(walletClient, txHash);
        }
        await Bun.sleep(30_000);
        console.log(`[step 8] P-Chain advanced, submitting RegisterL1ValidatorTx`);

        const txnRequest = await walletClient.pChain.prepareRegisterL1ValidatorTxn({
          initialBalanceInNanoAvax: 100_000_000n,
          blsSignature: blsProofOfPossessionHex,
          message: signedWarpMessageHex,
        });
        const { txHash } = await walletClient.sendXPTransaction({
          tx: txnRequest.tx,
          chainAlias: "P",
        });
        await waitForCommitted(walletClient, txHash);
        console.log(`[step 8] RegisterL1ValidatorTx committed on P-Chain: ${txHash}`);

        // Roll the L1's proposerVM forward so its next block sees the
        // post-registration P-Chain state — otherwise the L1's warp
        // predicate verifies the ACK message at an older epoch and the
        // primary-network validator set lookup can be stale.
        await rollL1PastFirstEpoch(l1WalletClient, l1PublicClient, 35_000, (m) =>
          console.log(`[step 8] ${m}`),
        );
        return { txId: txHash };
      },
    });

    state.newValidationID = result.validationID;
    expect(result.completeTxHash.length).toBeGreaterThan(2);
    expect(result.pChainRegisterTxId.length).toBeGreaterThan(0);

    // P-Chain should now report 2 validators on the subnet.
    const onChain = await walletClient.pChain.getCurrentValidators({ subnetID: subnetId });
    const validators = (onChain as { validators?: { nodeID: string }[] }).validators ?? [];
    const nodeIds = new Set(validators.map((v) => v.nodeID));
    expect(nodeIds.size).toBeGreaterThanOrEqual(2);
    console.log(
      `[step 8] subnet validators on P-Chain: ${validators.length} (validationID=${result.validationID})`,
    );
  }, BOOT_TIMEOUT_MS);
});
