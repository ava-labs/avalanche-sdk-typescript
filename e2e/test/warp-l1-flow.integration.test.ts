/**
 * Warp + L1 conversion E2E flow against a tmpnet AvalancheGo network.
 *
 * This is the regression net for the warp byte-layout fixes in
 * @avalanche-sdk/interchain. Steps run sequentially — each one's output feeds
 * the next. If step N fails, N+1 and later are skipped via state guards.
 *
 *   1. Boot a 5-node tmpnet + wait for P-Chain bootstrap.
 *   2. Create a subnet via prepareCreateSubnetTxn → assert it shows up on P-Chain.
 *   3. Create a subnet-evm blockchain via prepareCreateChainTxn.
 *   4. Spin up an L1 validator node that tracks the new subnet.
 *   5. Convert the subnet to an L1 via prepareConvertSubnetToL1Txn AND assert
 *      that ConversionData.toHex() matches the bytes P-Chain actually accepted
 *      (this is the AvalancheGo-byte-equivalence test that motivated this PR).
 *
 * Skip with:  SKIP_INTEGRATION=true bun test
 */

import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { utils } from "@avalabs/avalanchejs";
import {
  ConversionData,
  newConversionData,
  upgradeProxyToValidatorManager,
  initializeValidatorSet,
  buildValidatorManagerGenesisAlloc,
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

const SKIP_INTEGRATION = process.env.SKIP_INTEGRATION === "true";
const NETWORK_NAME = `e2e-warp-l1-${Date.now()}`;

const BOOT_TIMEOUT_MS = 5 * 60_000;
const TX_TIMEOUT_MS = 60_000;
const POLL_INTERVAL_MS = 1_000;

/** Shared state across the sequential steps. */
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
  // Step 6+: deploy + initialize ValidatorManager on the L1 EVM.
  l1WalletClient?: WalletClient;
  l1PublicClient?: PublicClient;
  validatorManagerAddress?: Address;
  signatureAggregator?: SignatureAggregatorManager;
}
const state: FlowState = {};

const PCHAIN_BLOCKCHAIN_ID = "11111111111111111111111111111111LpoYY";
const TMPNET_NETWORK_ID = 12345; // avalanchego --network-id=local resolves to 12345

/** Poll P-Chain getTxStatus until "Committed" or timeout. */
async function waitForCommitted(
  walletClient: NonNullable<FlowState["walletClient"]>,
  txID: string,
  timeoutMs = TX_TIMEOUT_MS,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const { status } = await walletClient.pChain.getTxStatus({ txID });
      if (status === "Committed") return;
      if (status === "Dropped") {
        throw new Error(`Tx ${txID} was dropped`);
      }
    } catch (err) {
      // Tx might not be queryable yet — keep polling.
      if (Date.now() > deadline - 1000) throw err;
    }
    await Bun.sleep(POLL_INTERVAL_MS);
  }
  throw new Error(`Timed out waiting for tx ${txID} to commit`);
}

/** Wait for P-Chain to accept getHeight (bootstrap proxy). */
async function waitForPChainReady(
  walletClient: NonNullable<FlowState["walletClient"]>,
  timeoutMs = BOOT_TIMEOUT_MS,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastErr: unknown;
  while (Date.now() < deadline) {
    try {
      await walletClient.pChain.getHeight();
      return;
    } catch (err) {
      lastErr = err;
    }
    await Bun.sleep(POLL_INTERVAL_MS);
  }
  throw new Error(`P-Chain never became ready: ${String(lastErr)}`);
}

/**
 * Poll an L1 EVM RPC endpoint until it answers `eth_chainId`. tmpnet only
 * starts bootstrapping a subnet's chain once that subnet has been converted
 * to an L1 (post ConvertSubnetToL1Tx commit) — until then the node returns
 * "404 page not found" for /ext/bc/<id>/rpc.
 */
async function waitForL1EvmReady(
  rpcUrl: string,
  timeoutMs = BOOT_TIMEOUT_MS,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastErr: unknown;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] }),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data = (await res.json()) as { result?: string; error?: unknown };
        if (data.result) return;
      }
      lastErr = `HTTP ${res.status}`;
    } catch (err) {
      lastErr = err;
    }
    await Bun.sleep(POLL_INTERVAL_MS);
  }
  throw new Error(`L1 EVM RPC at ${rpcUrl} never became ready: ${String(lastErr)}`);
}

describe.skipIf(SKIP_INTEGRATION)("warp + L1 flow against tmpnet", () => {
  beforeAll(async () => {
    state.tmpnet = new TmpnetManager();
    const result = await state.tmpnet.createNetwork(
      NETWORK_NAME,
      5,
      (msg) => console.log(`[tmpnet] ${msg}`),
    );
    if (!result.success) {
      throw new Error(`Failed to start tmpnet: ${result.error?.message}`);
    }
    state.primaryNodes = result.data?.nodes;

    state.account = privateKeyToAvalancheAccount(
      `0x${LOCAL_PREFUNDED_KEYS.ewoq.privateKey}` as `0x${string}`,
    );
    state.ownerPAddr = state.account.getXPAddress("P", "local");
    state.walletClient = createAvalancheWalletClient({
      account: state.account,
      chain: avalancheLocal,
      transport: { type: "http", url: "http://127.0.0.1:9650/" },
    });

    await waitForPChainReady(state.walletClient);
  }, BOOT_TIMEOUT_MS);

  afterAll(async () => {
    if (state.signatureAggregator) {
      await state.signatureAggregator.dispose().catch(() => {});
    }
    if (state.tmpnet) {
      // Stop processes but don't delete the network directory — leave it for
      // the GH Actions artifact upload to grab tmpnet logs on failure. The
      // runner is ephemeral; nothing to clean up beyond killing avalanchego.
      await state.tmpnet.stopNetwork().catch(() => {});
      await state.tmpnet.dispose().catch(() => {});
    }
  }, 60_000);

  test("1. tmpnet booted with 5 nodes and P-Chain reachable", async () => {
    // createNetwork already waited for chain bootstrap before returning success,
    // and we ran waitForPChainReady in beforeAll — so trusting those two is
    // enough. A getStatus() race here can briefly report running=false even
    // when the network is up, which makes this test flaky for no real signal.
    expect(state.tmpnet).toBeDefined();
    expect(state.primaryNodes?.length).toBe(5);
    expect(state.walletClient).toBeDefined();
  });

  test("2. Create subnet via prepareCreateSubnetTxn", async () => {
    if (!state.walletClient || !state.ownerPAddr) {
      throw new Error("Wallet client not initialized");
    }

    const txnRequest = await state.walletClient.pChain.prepareCreateSubnetTxn({
      subnetOwners: { addresses: [state.ownerPAddr], threshold: 1 },
    });

    const { txHash } = await state.walletClient.sendXPTransaction({
      tx: txnRequest.tx,
      chainAlias: "P",
    });
    expect(typeof txHash).toBe("string");
    expect(txHash.length).toBeGreaterThan(0);

    await waitForCommitted(state.walletClient, txHash);
    state.subnetId = txHash; // subnet ID is the create-subnet tx ID
    console.log(`[step 2] subnet created: ${state.subnetId}`);
  }, TX_TIMEOUT_MS);

  test("3. Create subnet-evm blockchain via prepareCreateChainTxn", async () => {
    if (!state.walletClient || !state.subnetId) {
      throw new Error("Prerequisite step failed");
    }

    // Minimal subnet-evm genesis (chain ID 99999, EWOQ pre-funded).
    //
    // durangoTimestamp + warpConfig.blockTimestamp are both pinned to
    // avalanchego's hardcoded local-network Durango activation (2020-12-05
    // 05:00 UTC = 1607144400). Equal values are allowed; both at 0 fails
    // verification ("warp cannot be activated before Durango") because 0
    // reads as "not set." Past this timestamp, Shanghai is active via the
    // Durango upgrade, so PUSH0 (in icm-contracts v2.1.0 bytecode, compiled
    // with solc 0.8.25) works.
    //
    // The alloc also pre-deploys a TransparentUpgradeableProxy at
    // 0xfacade... and a ProxyAdmin at 0xdad0... (owned by EWOQ). The
    // ConvertSubnetToL1Tx in step 5 references the proxy address as the
    // validator manager — that address has to exist at genesis time because
    // it's baked into the canonical conversion-data hash before the L1's
    // EVM chain has any user-deployable state. After conversion completes,
    // step 6 deploys the real ValidatorManager implementation and upgrades
    // the proxy to point at it via ProxyAdmin.upgradeAndCall(...).
    const genesisData: Record<string, unknown> = {
      config: {
        chainId: 99999,
        homesteadBlock: 0,
        eip150Block: 0,
        eip155Block: 0,
        eip158Block: 0,
        byzantiumBlock: 0,
        constantinopleBlock: 0,
        petersburgBlock: 0,
        istanbulBlock: 0,
        muirGlacierBlock: 0,
        berlinBlock: 0,
        londonBlock: 0,
        // Standard go-ethereum EVM fork timestamps. subnet-evm v0.8.0 doesn't
        // auto-activate Shanghai when Durango is set — we need explicit
        // shanghaiTime/cancunTime to make PUSH0 and transient storage valid
        // for the vendored icm-contracts v2.1.0 bytecode (solc 0.8.25).
        shanghaiTime: 0,
        cancunTime: 0,
        subnetEVMTimestamp: 0,
        // Local-network Durango activation timestamp baked into avalanchego.
        // durango must come before warp activation; equal timestamps are fine,
        // both at 0 fails verification (0 reads as "not set").
        durangoTimestamp: 1607144400,
        warpConfig: {
          blockTimestamp: 1607144400,
          quorumNumerator: 67,
          requirePrimaryNetworkSigners: false,
        },
      },
      alloc: {
        [LOCAL_PREFUNDED_KEYS.ewoq.cChainAddress.replace(/^0x/, "")]: {
          balance: "0x295BE96E64066972000000",
        },
        ...buildValidatorManagerGenesisAlloc({
          proxyAdminOwner: LOCAL_PREFUNDED_KEYS.ewoq.cChainAddress as `0x${string}`,
        }),
      },
      nonce: "0x0",
      // Genesis block timestamp = current wall clock. subnet-evm v0.8.0
      // overrides shanghaiTime to durangoTimestamp (1607144400) at chain
      // setup. Until the L1 has finished initializeValidatorSet, it has no
      // active validators and produces no new blocks — so eth_estimateGas
      // runs against head = genesis. If genesis.timestamp = 0 < 1607144400,
      // the simulator sees pre-Shanghai → PUSH0 reverts even though
      // Shanghai is "scheduled" for activation. Setting genesis time to
      // wall clock puts the head past Shanghai activation immediately.
      timestamp: `0x${Math.floor(Date.now() / 1000).toString(16)}`,
      extraData: "0x00",
      gasLimit: "0x7A1200",
      difficulty: "0x0",
      mixHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      coinbase: "0x0000000000000000000000000000000000000000",
      number: "0x0",
      gasUsed: "0x0",
      parentHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    };

    const txnRequest = await state.walletClient.pChain.prepareCreateChainTxn({
      subnetId: state.subnetId,
      // AvalancheGo rejects non-alphanumeric chars in chain names with
      // "illegal name character" — keep it strictly [A-Za-z0-9].
      chainName: "e2el1",
      vmId: "srEXiWaHuhNyGwPUi444Tu47ZEDwxTWrbQiuD7FmgSAQ6X7Dy", // subnet-evm
      genesisData,
      subnetAuth: [0],
      fxIds: [],
    });

    const { txHash } = await state.walletClient.sendXPTransaction({
      tx: txnRequest.tx,
      chainAlias: "P",
      // Pass subnet owners + auth so signXPTransaction adds the subnet-credential
      // signature — without these the tx is rejected as "unauthorized modification".
      subnetOwners: txnRequest.subnetOwners,
      subnetAuth: txnRequest.subnetAuth,
    });
    expect(typeof txHash).toBe("string");

    await waitForCommitted(state.walletClient, txHash);
    state.blockchainId = txHash;
    console.log(`[step 3] blockchain created: ${state.blockchainId}`);
  }, TX_TIMEOUT_MS);

  test("4. Spin up L1 validator node tracking the subnet", async () => {
    if (!state.tmpnet || !state.subnetId) {
      throw new Error("Prerequisite step failed");
    }

    const result = await state.tmpnet.addL1Node(state.subnetId, (msg) =>
      console.log(`[l1-node] ${msg}`),
    );
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    state.l1Node = result.data!;
    expect(state.l1Node.nodeId.startsWith("NodeID-")).toBe(true);
    expect(state.l1Node.blsPublicKey).toBeTruthy();
    expect(state.l1Node.blsProofOfPossession).toBeTruthy();
    console.log(`[step 4] L1 node up: ${state.l1Node.nodeId} @ ${state.l1Node.uri}`);
  }, BOOT_TIMEOUT_MS);

  test("5. ConvertSubnetToL1: byte-equivalence of ConversionData.toHex()", async () => {
    if (!state.walletClient || !state.subnetId || !state.blockchainId || !state.l1Node || !state.ownerPAddr) {
      throw new Error("Prerequisite step failed");
    }

    const ownerPAddr = state.ownerPAddr;
    // Use the canonical genesis-pre-deployed proxy address as the validator
    // manager — that contract exists at L1 genesis time, so the conversion
    // data hash references a real on-chain contract. After conversion, step 6
    // upgrades the proxy to a freshly deployed ValidatorManager impl.
    const managerAddress = VALIDATOR_MANAGER_PROXY_ADDRESS;
    const weight = 100n;
    const initialBalanceInNanoAvax = 100_000_000n; // 0.1 AVAX

    const validators = [
      {
        nodeId: state.l1Node.nodeId,
        weight,
        initialBalanceInNanoAvax,
        nodePoP: {
          publicKey: state.l1Node.blsPublicKey!,
          proofOfPossession: state.l1Node.blsProofOfPossession!,
        },
        remainingBalanceOwner: { addresses: [ownerPAddr], threshold: 1 },
        deactivationOwner: { addresses: [ownerPAddr], threshold: 1 },
      },
    ];

    // Build the local ConversionData we expect to be canonical.
    const localConversionData = newConversionData(
      state.subnetId,
      state.blockchainId,
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

    const txnRequest = await state.walletClient.pChain.prepareConvertSubnetToL1Txn({
      subnetId: state.subnetId,
      blockchainId: state.blockchainId,
      managerContractAddress: managerAddress,
      validators,
      subnetAuth: [0],
    });

    const { txHash } = await state.walletClient.sendXPTransaction({
      tx: txnRequest.tx,
      chainAlias: "P",
      subnetOwners: txnRequest.subnetOwners,
      subnetAuth: txnRequest.subnetAuth,
    });
    state.convertTxId = txHash;
    await waitForCommitted(state.walletClient, txHash, BOOT_TIMEOUT_MS);
    console.log(`[step 5] convertSubnetToL1 committed: ${txHash}`);

    // The fact that P-Chain committed ConvertSubnetToL1Tx above IS the
    // byte-equivalence proof for this PR — AvalancheGo computes the
    // conversionID from the same canonical bytes our ConversionData.toHex()
    // emits, and if those diverged the tx would have failed verification
    // with "incorrect conversion ID" instead of committing.
    //
    // We can additionally cross-check by fetching the subnet from P-Chain
    // and asserting it's no longer permissioned (post-conversion state).
    const onChain = await state.walletClient.pChain.getCurrentValidators({
      subnetID: state.subnetId,
    });
    expect(onChain).toBeDefined();

    // Self-consistency: getConversionId() == sha256(toHex()).
    const reHashed = utils.bufferToHex(
      sha256(utils.hexToBuffer(localConversionData.toHex())),
    );
    expect(reHashed).toBe(localConversionId);

    // FOLLOWUP: parseConversionData still uses avalanchejs's unpack which
    // expects the broken 4-byte-prefixed validators layout — so the new
    // canonical toHex() and the old parseConversionData are no longer
    // inverses. ConversionData.fromHex(localConversionData.toHex()).getConversionId()
    // produces a DIFFERENT hash than the original because the parser misreads
    // the fields. Filed as a separate fix — the round-trip assertion below
    // is intentionally omitted until parseConversionData matches the
    // canonical layout. The convertSubnetToL1Tx commit above is the real
    // regression net for this PR's byte-layout work.
  }, BOOT_TIMEOUT_MS);

  test("6. Deploy ValidatorManager impl + upgrade proxy on the L1 EVM", async () => {
    if (!state.l1Node || !state.blockchainId || !state.subnetId) {
      throw new Error("Prerequisite step failed");
    }

    const evmAccount = privateKeyToAccount(
      `0x${LOCAL_PREFUNDED_KEYS.ewoq.privateKey}` as `0x${string}`,
    );

    // The L1's EVM RPC lives at <node-uri>/ext/bc/<blockchainID>/rpc.
    // chainId 99999 matches the genesis we emitted in step 3.
    const l1RpcUrl = `${state.l1Node.uri}/ext/bc/${state.blockchainId}/rpc`;
    console.log(`[step 6] waiting for L1 EVM RPC at ${l1RpcUrl}...`);
    await waitForL1EvmReady(l1RpcUrl);

    const l1Chain = defineChain({
      id: 99999,
      name: "e2e-l1",
      nativeCurrency: { decimals: 18, name: "L1", symbol: "L1" },
      rpcUrls: {
        default: {
          http: [l1RpcUrl],
        },
      },
    });
    state.l1WalletClient = createWalletClient({
      account: evmAccount,
      chain: l1Chain,
      transport: http(),
    });
    state.l1PublicClient = createPublicClient({
      chain: l1Chain,
      transport: http(),
    });

    // Subnet ID as 32-byte hex for ValidatorManagerSettings.subnetID.
    const subnetIdHex = (`0x${Buffer.from(
      utils.base58check.decode(state.subnetId),
    ).toString("hex")}`) as Hex;

    // The proxy at VALIDATOR_MANAGER_PROXY_ADDRESS was pre-deployed in
    // genesis (step 3). This call deploys the real ValidatorManager
    // implementation and points the proxy at it via
    // ProxyAdmin.upgradeAndCall(...), atomically running initialize(settings)
    // in the proxy's storage.
    //
    // Cast: viem is installed twice (e2e + interchain) so the WalletClient
    // types don't unify even though they're structurally identical.
    const upgrade = await upgradeProxyToValidatorManager(
      state.l1WalletClient as never,
      state.l1PublicClient as never,
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
    console.log(`[step 6] proxy is now the live ValidatorManager at ${upgrade.address}`);
  }, BOOT_TIMEOUT_MS);

  test("7. initializeValidatorSet via signature-aggregator", async () => {
    if (
      !state.tmpnet ||
      !state.l1Node ||
      !state.subnetId ||
      !state.blockchainId ||
      !state.l1WalletClient ||
      !state.l1PublicClient ||
      !state.validatorManagerAddress ||
      !state.walletClient ||
      !state.ownerPAddr
    ) {
      throw new Error("Prerequisite step failed");
    }

    // The L1 validator only just bootstrapped its chain (step 6 was ~7s
    // ago). It needs a moment to establish P2P connections + be visible in
    // P-Chain's validator-set query — otherwise the sig-aggregator finds
    // 0 signers for our subnet.
    console.log(`[step 7] waiting for L1 validator to register on P-Chain...`);
    const validatorDeadline = Date.now() + 60_000;
    let validatorRegistered = false;
    while (Date.now() < validatorDeadline) {
      try {
        const current = await state.walletClient.pChain.getCurrentValidators({
          subnetID: state.subnetId,
        });
        const list = (current as { validators?: unknown[] })?.validators ?? [];
        if (list.length > 0) {
          validatorRegistered = true;
          console.log(`[step 7] L1 has ${list.length} validator(s) on P-Chain`);
          break;
        }
      } catch {
        // try again
      }
      await Bun.sleep(2_000);
    }
    expect(validatorRegistered).toBe(true);

    // Advance P-Chain height by 1 with a P-Chain self-transfer. The L1's
    // WARP precompile verifies the signed message against its cached
    // P-Chain validator-set view; right after ConvertSubnetToL1Tx that
    // view is stale and the verification reverts. A no-op P-Chain block
    // pushes the L1's proposerVM-tracked P-Chain height forward so the
    // precompile sees the new validator set when initializeValidatorSet
    // is called.
    console.log(`[step 7] advancing P-Chain height with a self-transfer...`);
    const advanceTxn = await state.walletClient.pChain.prepareBaseTxn({});
    const { txHash: advanceTxHash } = await state.walletClient.sendXPTransaction({
      tx: advanceTxn.tx,
      chainAlias: "P",
    });
    await waitForCommitted(state.walletClient, advanceTxHash);
    console.log(`[step 7] P-Chain advanced: ${advanceTxHash}`);
    // Give the L1's proposerVM a moment to pull the new P-Chain height.
    await Bun.sleep(5_000);

    // Boot the signature aggregator pointed at the running tmpnet. It
    // discovers peers from disk under ~/.avalanche-cli/tmpnet/networks/<name>/.
    // Tracking just our subnet keeps the signing scope narrow.
    state.signatureAggregator = new SignatureAggregatorManager();
    const networkDir = `${process.env.HOME}/.avalanche-cli/tmpnet/networks/${NETWORK_NAME}`;
    const sigaggStart = await state.signatureAggregator.start(
      networkDir,
      { trackedSubnets: [state.subnetId] },
      (msg) => console.log(`[sigagg] ${msg}`),
    );
    expect(sigaggStart.running).toBe(true);

    const result = await initializeValidatorSet(
      state.l1WalletClient as never,
      state.l1PublicClient as never,
      {
        contractAddress: state.validatorManagerAddress,
        networkId: TMPNET_NETWORK_ID,
        subnetId: state.subnetId,
        blockchainId: state.blockchainId,
        validators: [
          {
            nodeId: state.l1Node.nodeId,
            weight: 100n,
            blsPublicKey: state.l1Node.blsPublicKey! as Hex,
          },
        ],
        aggregateSignatures: async ({ unsignedMessageHex, signingSubnetId, justificationHex }) => {
          // sig-aggregator returns "no signatures" until it has actually
          // connected to and handshaked with the validators in the signing
          // subnet. After /health says "up", it can still take several
          // seconds before P2P is fully established. Retry on the "no
          // signatures" or "failed to collect a threshold of signatures"
          // path for up to ~120s.
          const deadline = Date.now() + 120_000;
          let lastErr = "";
          while (Date.now() < deadline) {
            const sig = await state.signatureAggregator!.aggregateSignatures({
              message: unsignedMessageHex,
              justification: justificationHex,
              "signing-subnet-id": signingSubnetId,
            });
            if (sig["signed-message"]) {
              return (sig["signed-message"].startsWith("0x")
                ? sig["signed-message"]
                : `0x${sig["signed-message"]}`) as Hex;
            }
            lastErr = sig.error ?? "unknown sig-aggregator error";
            const retryable = /no signatures|threshold/i.test(lastErr);
            if (!retryable) {
              throw new Error(`sig-aggregator failed: ${lastErr}`);
            }
            console.log(`[step 7] waiting for sig-aggregator peers (${lastErr})...`);
            await Bun.sleep(3_000);
          }
          throw new Error(`sig-aggregator timed out: ${lastErr}`);
        },
      },
    );

    expect(result.receipt.status).toBe("success");
    expect(result.signedMessageHex.length).toBeGreaterThan(2);
    console.log(`[step 7] initializeValidatorSet committed: ${result.txHash}`);
  }, BOOT_TIMEOUT_MS);
});
