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
  disableL1Validator,
  registerL1Validator,
  setL1ValidatorWeight,
  upgradeProxyToValidatorManager,
  VALIDATOR_MANAGER_PROXY_ADDRESS,
  ValidatorManagerAbi,
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
  /** Raw RegisterL1ValidatorMessage payload bytes captured at register time — needed as the justification for the removal ACK. */
  registerMessagePayloadHex?: Hex;
  /** Third L1 node, registered fresh for the force-removal path so we don't trip the contract's "node already registered" check on node2's NodeID. */
  l1Node3?: NodeInfo;
  validationID3?: Hex;
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

// ValidatorStatus enum values from icm-contracts (must match contract):
//   Unknown=0 PendingAdded=1 Active=2 PendingRemoved=3 Completed=4
enum ValidatorStatus {
  Unknown = 0,
  PendingAdded = 1,
  Active = 2,
  PendingRemoved = 3,
  Completed = 4,
}

interface OnChainValidator {
  status: number;
  nodeID: Hex;
  startingWeight: bigint;
  sentNonce: bigint;
  receivedNonce: bigint;
  weight: bigint;
  startTime: bigint;
  endTime: bigint;
}

async function readValidator(
  pc: PublicClient,
  contractAddress: Address,
  validationID: Hex,
): Promise<OnChainValidator> {
  return (await pc.readContract({
    address: contractAddress,
    abi: ValidatorManagerAbi,
    functionName: "getValidator",
    args: [validationID],
  })) as OnChainValidator;
}

async function readL1TotalWeight(pc: PublicClient, contractAddress: Address): Promise<bigint> {
  return (await pc.readContract({
    address: contractAddress,
    abi: ValidatorManagerAbi,
    functionName: "l1TotalWeight",
  })) as bigint;
}

async function readIsValidatorSetInitialized(
  pc: PublicClient,
  contractAddress: Address,
): Promise<boolean> {
  return (await pc.readContract({
    address: contractAddress,
    abi: ValidatorManagerAbi,
    functionName: "isValidatorSetInitialized",
  })) as boolean;
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

    // Contract state: validator set should now be marked initialized, and
    // the bootstrap validator's weight should match what we passed in
    // ConvertSubnetToL1 (100).
    expect(
      await readIsValidatorSetInitialized(l1PublicClient, validatorManagerAddress),
    ).toBe(true);
    expect(await readL1TotalWeight(l1PublicClient, validatorManagerAddress)).toBe(100n);
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
    state.registerMessagePayloadHex = result.registerMessagePayloadHex;
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

    // Contract state: new validator is Active at weight 1, total weight 101.
    const v = await readValidator(
      l1PublicClient,
      validatorManagerAddress,
      result.validationID,
    );
    expect(v.status).toBe(ValidatorStatus.Active);
    expect(v.weight).toBe(1n);
    expect(v.startingWeight).toBe(1n);
    expect(await readL1TotalWeight(l1PublicClient, validatorManagerAddress)).toBe(101n);
  }, BOOT_TIMEOUT_MS);

  test("9. setL1ValidatorWeight: bump the new validator's weight 1 → 2", async () => {
    const {
      subnetId,
      l1WalletClient,
      l1PublicClient,
      validatorManagerAddress,
      walletClient,
      signatureAggregator,
      newValidationID,
    } = requireState(
      "subnetId",
      "l1WalletClient",
      "l1PublicClient",
      "validatorManagerAddress",
      "walletClient",
      "signatureAggregator",
      "newValidationID",
    );

    const aggregateSignatures = buildAggregateSignaturesFn(signatureAggregator, {
      log: (m) => console.log(`[step 9] ${m}`),
    });

    const result = await setL1ValidatorWeight(l1WalletClient as never, l1PublicClient as never, {
      validatorManagerAddress,
      networkId: TMPNET_NETWORK_ID,
      subnetId,
      validationID: newValidationID,
      newWeight: 2n,
      aggregateSignatures,
      submitPChainSetWeightTx: async ({ signedWarpMessageHex }) => {
        // Same P-Chain advance/sleep dance as step 8: GetMinimumHeight lag
        // means we have to push P-Chain forward + wait before the mempool
        // verifier will accept the warp message.
        for (let i = 0; i < 2; i++) {
          const adv = await walletClient.pChain.prepareBaseTxn({});
          const { txHash } = await walletClient.sendXPTransaction({
            tx: adv.tx,
            chainAlias: "P",
          });
          await waitForCommitted(walletClient, txHash);
        }
        await Bun.sleep(30_000);

        const txnRequest = await walletClient.pChain.prepareSetL1ValidatorWeightTxn({
          message: signedWarpMessageHex,
        });
        const { txHash } = await walletClient.sendXPTransaction({
          tx: txnRequest.tx,
          chainAlias: "P",
        });
        await waitForCommitted(walletClient, txHash);
        console.log(`[step 9] SetL1ValidatorWeightTx committed on P-Chain: ${txHash}`);

        await rollL1PastFirstEpoch(l1WalletClient, l1PublicClient, 35_000, (m) =>
          console.log(`[step 9] ${m}`),
        );
        return { txId: txHash };
      },
    });

    expect(result.completeTxHash.length).toBeGreaterThan(2);
    expect(result.pChainSetWeightTxId.length).toBeGreaterThan(0);
    expect(result.nonce).toBeGreaterThan(0n);
    console.log(
      `[step 9] weight updated nonce=${result.nonce} completeTx=${result.completeTxHash}`,
    );

    // Contract state: validator weight bumped, total weight = 100 + 2 = 102.
    const v = await readValidator(
      l1PublicClient,
      validatorManagerAddress,
      newValidationID,
    );
    expect(v.status).toBe(ValidatorStatus.Active);
    expect(v.weight).toBe(2n);
    expect(v.sentNonce).toBeGreaterThan(0n);
    expect(v.receivedNonce).toBe(v.sentNonce);
    expect(await readL1TotalWeight(l1PublicClient, validatorManagerAddress)).toBe(102n);
  }, BOOT_TIMEOUT_MS);

  test("10. disableL1Validator: remove the new validator", async () => {
    const {
      subnetId,
      l1WalletClient,
      l1PublicClient,
      validatorManagerAddress,
      walletClient,
      signatureAggregator,
      newValidationID,
      registerMessagePayloadHex,
      l1Node2,
    } = requireState(
      "subnetId",
      "l1WalletClient",
      "l1PublicClient",
      "validatorManagerAddress",
      "walletClient",
      "signatureAggregator",
      "newValidationID",
      "registerMessagePayloadHex",
      "l1Node2",
    );

    const aggregateSignatures = buildAggregateSignaturesFn(signatureAggregator, {
      log: (m) => console.log(`[step 10] ${m}`),
    });

    const result = await disableL1Validator(l1WalletClient as never, l1PublicClient as never, {
      validatorManagerAddress,
      networkId: TMPNET_NETWORK_ID,
      subnetId,
      validationID: newValidationID,
      registerMessagePayloadHex,
      l1PublicClient: l1PublicClient as never,
      aggregateSignatures,
      submitPChainSetWeightTx: async ({ signedWarpMessageHex }) => {
        for (let i = 0; i < 2; i++) {
          const adv = await walletClient.pChain.prepareBaseTxn({});
          const { txHash } = await walletClient.sendXPTransaction({
            tx: adv.tx,
            chainAlias: "P",
          });
          await waitForCommitted(walletClient, txHash);
        }
        await Bun.sleep(30_000);

        const txnRequest = await walletClient.pChain.prepareSetL1ValidatorWeightTxn({
          message: signedWarpMessageHex,
        });
        const { txHash } = await walletClient.sendXPTransaction({
          tx: txnRequest.tx,
          chainAlias: "P",
        });
        await waitForCommitted(walletClient, txHash);
        console.log(`[step 10] SetL1ValidatorWeightTx (weight=0) committed on P-Chain: ${txHash}`);

        await rollL1PastFirstEpoch(l1WalletClient, l1PublicClient, 35_000, (m) =>
          console.log(`[step 10] ${m}`),
        );
        return { txId: txHash };
      },
    });

    expect(result.completeTxHash.length).toBeGreaterThan(2);
    expect(result.pChainSetWeightTxId.length).toBeGreaterThan(0);

    // P-Chain should be back down to 1 validator on the subnet.
    const onChain = await walletClient.pChain.getCurrentValidators({ subnetID: subnetId });
    const validators = (onChain as { validators?: { nodeID: string }[] }).validators ?? [];
    const stillThere = validators.some((v) => v.nodeID === l1Node2.nodeId);
    expect(stillThere).toBe(false);
    console.log(
      `[step 10] subnet validators on P-Chain: ${validators.length} (removed ${l1Node2.nodeId})`,
    );

    // Contract state: validator status moves to Completed, endTime set,
    // total weight drops back to bootstrap only (100).
    const v = await readValidator(
      l1PublicClient,
      validatorManagerAddress,
      newValidationID,
    );
    expect(v.status).toBe(ValidatorStatus.Completed);
    expect(v.endTime).toBeGreaterThan(0n);
    expect(await readL1TotalWeight(l1PublicClient, validatorManagerAddress)).toBe(100n);
  }, BOOT_TIMEOUT_MS);

  test("11. registerL1Validator: add a 3rd validator (setup for force-removal)", async () => {
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

    const addResult = await tmpnet.addL1Node(subnetId, (m) => console.log(`[l1-node-3] ${m}`));
    expect(addResult.success).toBe(true);
    const node3 = addResult.data!;
    state.l1Node3 = node3;
    expect(node3.signerKeyPath).toBeTruthy();
    console.log(`[step 11] L1 node 3 up: ${node3.nodeId} @ ${node3.uri}`);

    const blsKeypair = loadValidatorBlsKeypair(node3.signerKeyPath!);
    const ownerPAddrBytes = utils.bech32ToBytes(ownerPAddr);
    const ownerAddrHex = `0x${Buffer.from(ownerPAddrBytes).toString("hex")}` as Address;
    const balanceOwner = { threshold: 1, addresses: [ownerAddrHex] as const };

    const aggregateSignatures = buildAggregateSignaturesFn(signatureAggregator, {
      log: (m) => console.log(`[step 11] ${m}`),
    });

    const result = await registerL1Validator(l1WalletClient as never, l1PublicClient as never, {
      validatorManagerAddress,
      networkId: TMPNET_NETWORK_ID,
      subnetId,
      validator: {
        nodeId: node3.nodeId,
        blsPublicKey: blsKeypair.publicKey,
        weight: 1n,
        remainingBalanceOwner: balanceOwner,
        disableOwner: balanceOwner,
      },
      aggregateSignatures,
      getBlsProofOfPossession: async () => blsKeypair.proofOfPossession,
      submitPChainRegisterTx: async ({ signedWarpMessageHex, blsProofOfPossessionHex }) => {
        for (let i = 0; i < 2; i++) {
          const adv = await walletClient.pChain.prepareBaseTxn({});
          const { txHash } = await walletClient.sendXPTransaction({
            tx: adv.tx,
            chainAlias: "P",
          });
          await waitForCommitted(walletClient, txHash);
        }
        await Bun.sleep(30_000);

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
        console.log(`[step 11] RegisterL1ValidatorTx committed on P-Chain: ${txHash}`);
        await rollL1PastFirstEpoch(l1WalletClient, l1PublicClient, 35_000, (m) =>
          console.log(`[step 11] ${m}`),
        );
        return { txId: txHash };
      },
    });

    state.validationID3 = result.validationID;
    expect(result.completeTxHash.length).toBeGreaterThan(2);
    console.log(`[step 11] node 3 registered (validationID=${result.validationID})`);

    // Contract state mirrors step 8 but for node3.
    const v = await readValidator(
      l1PublicClient,
      validatorManagerAddress,
      result.validationID,
    );
    expect(v.status).toBe(ValidatorStatus.Active);
    expect(v.weight).toBe(1n);
    expect(await readL1TotalWeight(l1PublicClient, validatorManagerAddress)).toBe(101n);
  }, BOOT_TIMEOUT_MS);

  test("12. force-disable on P-Chain via DisableL1ValidatorTx", async () => {
    const {
      walletClient,
      subnetId,
      validationID3,
      l1Node3,
      l1PublicClient,
      validatorManagerAddress,
    } = requireState(
      "walletClient",
      "subnetId",
      "validationID3",
      "l1Node3",
      "l1PublicClient",
      "validatorManagerAddress",
    );

    // Force-removal is a direct P-Chain tx authorized by the validator's
    // disableOwner (NOT the validator-manager contract). After this commits,
    // P-Chain drops the validator, but the contract's _validationPeriods
    // entry stays Active until separately reconciled — that's the "force"
    // part of force-removal.
    const validationIdB58 = utils.base58check.encode(utils.hexToBuffer(validationID3));

    // Advance P-Chain a bit so the mempool verifier sees the validator
    // (registered in step 11) at a stable height.
    for (let i = 0; i < 2; i++) {
      const adv = await walletClient.pChain.prepareBaseTxn({});
      const { txHash } = await walletClient.sendXPTransaction({
        tx: adv.tx,
        chainAlias: "P",
      });
      await waitForCommitted(walletClient, txHash);
    }
    await Bun.sleep(30_000);

    const txnRequest = await walletClient.pChain.prepareDisableL1ValidatorTxn({
      validationId: validationIdB58,
      disableAuth: [0],
    });
    const { txHash } = await walletClient.sendXPTransaction({
      tx: txnRequest.tx,
      chainAlias: "P",
      disableOwners: txnRequest.disableOwners,
      disableAuth: txnRequest.disableAuth,
    });
    await waitForCommitted(walletClient, txHash);
    console.log(`[step 12] DisableL1ValidatorTx committed on P-Chain: ${txHash}`);

    // DisableL1ValidatorTx *deactivates* the L1 validator and refunds its
    // remaining balance — it does NOT remove the validator from the L1's
    // validator set the way SetL1ValidatorWeightTx(weight=0) does. Per the
    // P-Chain tx-format spec ("Disable an L1 validator without removing
    // them as a validator"). After this commits, getCurrentValidators still
    // lists node3, but its balance refund means `accruedFees ≥ initialBalance`
    // and the validator is functionally inactive for warp / consensus
    // until re-enabled (which requires an IncreaseL1ValidatorBalanceTx).
    //
    // Assertion: tx committed (already verified by waitForCommitted) and the
    // validator's recorded balance has dropped to 0, indicating it was
    // refunded. The validator may either be absent from getCurrentValidators
    // (some avalanchego versions filter inactive validators out) or present
    // with balance=0 — accept both.
    const onChain = await walletClient.pChain.getCurrentValidators({ subnetID: subnetId });
    const validators = (onChain as {
      validators?: Array<{ nodeID: string; balance?: string; weight?: string }>;
    }).validators ?? [];
    const stillListed = validators.find((v) => v.nodeID === l1Node3.nodeId);
    if (stillListed) {
      console.log(
        `[step 12] node3 still listed but inactive: balance=${stillListed.balance} weight=${stillListed.weight}`,
      );
      expect(BigInt(stillListed.balance ?? "0")).toBe(0n);
    } else {
      console.log(`[step 12] node3 dropped from getCurrentValidators (force-disable refunded + removed)`);
    }
    console.log(
      `[step 12] subnet validators on P-Chain: ${validators.length} (force-disabled ${l1Node3.nodeId})`,
    );

    // KEY OBSERVATION: the validator-manager CONTRACT did not participate
    // in this removal — its _validationPeriods[validationID3] entry is
    // still Active even though P-Chain force-disabled the validator. This
    // is the "stale contract state" risk of force-disable. Steps 13–14
    // exercise the admin-recovery path that reconciles it.
    const v = await readValidator(l1PublicClient, validatorManagerAddress, validationID3);
    expect(v.status).toBe(ValidatorStatus.Active);
    expect(await readL1TotalWeight(l1PublicClient, validatorManagerAddress)).toBe(101n);
    console.log(
      `[step 12] contract state is stale: status=${v.status} (Active=2), totalWeight=101 — admin reconciliation needed`,
    );
  }, BOOT_TIMEOUT_MS);

  test("13. IncreaseL1ValidatorBalanceTx reactivates node3 on P-Chain", async () => {
    const { walletClient, subnetId, validationID3, l1Node3 } = requireState(
      "walletClient",
      "subnetId",
      "validationID3",
      "l1Node3",
    );

    // Per the P-Chain spec, IncreaseL1ValidatorBalanceTx tops up a
    // validator's balance AND reactivates it if it was inactive — the
    // counterpart to step 12's force-disable.
    const validationIdB58 = utils.base58check.encode(utils.hexToBuffer(validationID3));
    const topUpAmount = 200_000_000n; // 0.2 AVAX in nanoAVAX

    const txnRequest = await walletClient.pChain.prepareIncreaseL1ValidatorBalanceTxn({
      validationId: validationIdB58,
      balanceInNanoAvax: topUpAmount,
    });
    const { txHash } = await walletClient.sendXPTransaction({
      tx: txnRequest.tx,
      chainAlias: "P",
    });
    await waitForCommitted(walletClient, txHash);
    console.log(`[step 13] IncreaseL1ValidatorBalanceTx committed on P-Chain: ${txHash}`);

    // After the top-up, P-Chain should report node3 with positive balance
    // again (the refund-then-topup round-trip).
    const onChain = await walletClient.pChain.getCurrentValidators({ subnetID: subnetId });
    const validators = (onChain as {
      validators?: Array<{ nodeID: string; balance?: string; weight?: string }>;
    }).validators ?? [];
    const node3State = validators.find((v) => v.nodeID === l1Node3.nodeId);
    expect(node3State).toBeDefined();
    expect(BigInt(node3State?.balance ?? "0")).toBe(topUpAmount);
    console.log(
      `[step 13] node3 reactivated: balance=${node3State?.balance} weight=${node3State?.weight}`,
    );
  }, BOOT_TIMEOUT_MS);

  test("14. reconcile contract via disableL1Validator (admin recovery path)", async () => {
    const {
      subnetId,
      l1WalletClient,
      l1PublicClient,
      validatorManagerAddress,
      walletClient,
      signatureAggregator,
      validationID3,
      l1Node3,
    } = requireState(
      "subnetId",
      "l1WalletClient",
      "l1PublicClient",
      "validatorManagerAddress",
      "walletClient",
      "signatureAggregator",
      "validationID3",
      "l1Node3",
    );

    // After step 12's force-disable, the contract's _validationPeriods entry
    // for node3 is stale (status=Active). After step 13 reactivated node3 on
    // P-Chain, we now do a normal contract-driven removal to bring P-Chain
    // and contract back in sync. This is the operational pattern an L1 admin
    // would follow to clean up after an emergency force-disable.

    const aggregateSignatures = buildAggregateSignaturesFn(signatureAggregator, {
      log: (m) => console.log(`[step 14] ${m}`),
    });

    const result = await disableL1Validator(l1WalletClient as never, l1PublicClient as never, {
      validatorManagerAddress,
      networkId: TMPNET_NETWORK_ID,
      subnetId,
      validationID: validationID3,
      l1PublicClient: l1PublicClient as never,
      aggregateSignatures,
      submitPChainSetWeightTx: async ({ signedWarpMessageHex }) => {
        for (let i = 0; i < 2; i++) {
          const adv = await walletClient.pChain.prepareBaseTxn({});
          const { txHash } = await walletClient.sendXPTransaction({
            tx: adv.tx,
            chainAlias: "P",
          });
          await waitForCommitted(walletClient, txHash);
        }
        await Bun.sleep(30_000);

        const txnRequest = await walletClient.pChain.prepareSetL1ValidatorWeightTxn({
          message: signedWarpMessageHex,
        });
        const { txHash } = await walletClient.sendXPTransaction({
          tx: txnRequest.tx,
          chainAlias: "P",
        });
        await waitForCommitted(walletClient, txHash);
        console.log(`[step 14] SetL1ValidatorWeightTx (weight=0) committed on P-Chain: ${txHash}`);

        await rollL1PastFirstEpoch(l1WalletClient, l1PublicClient, 35_000, (m) =>
          console.log(`[step 14] ${m}`),
        );
        return { txId: txHash };
      },
    });

    expect(result.completeTxHash.length).toBeGreaterThan(2);

    // Contract state now matches P-Chain: validator status=Completed,
    // totalWeight back to bootstrap only.
    const v = await readValidator(l1PublicClient, validatorManagerAddress, validationID3);
    expect(v.status).toBe(ValidatorStatus.Completed);
    expect(v.endTime).toBeGreaterThan(0n);
    expect(await readL1TotalWeight(l1PublicClient, validatorManagerAddress)).toBe(100n);

    // P-Chain also no longer lists node3.
    const onChain = await walletClient.pChain.getCurrentValidators({ subnetID: subnetId });
    const validators = (onChain as { validators?: { nodeID: string }[] }).validators ?? [];
    const stillThere = validators.some((v2) => v2.nodeID === l1Node3.nodeId);
    expect(stillThere).toBe(false);
    console.log(
      `[step 14] reconciliation complete: contract Completed, P-Chain validators=${validators.length}`,
    );
  }, BOOT_TIMEOUT_MS);
});
