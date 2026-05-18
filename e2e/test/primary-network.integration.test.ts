/**
 * Primary network E2E flow against a tmpnet AvalancheGo network.
 *
 * Covers the P-Chain and C-Chain transactions that have NOTHING to do with
 * the L1 / warp-message dance:
 *   - Atomic transfers (P ↔ C export/import)
 *   - Permissionless validator + delegator staking
 *   - Legacy permissioned-subnet validator (AddSubnetValidator + Remove)
 *
 * Lives in its own file so the run is independent of the much-longer
 * warp-l1-flow test. Same tmpnet shape (5 primary validators), runs in
 * roughly half the time.
 *
 * Skip with:  SKIP_INTEGRATION=true bun test
 */

import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { utils } from "@avalabs/avalanchejs";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheLocal } from "@avalanche-sdk/client/chains";
import { createAvalancheWalletClient } from "@avalanche-sdk/client";

import { LOCAL_PREFUNDED_KEYS } from "../src/tmpnet/constants.ts";
import { TmpnetManager } from "../src/tmpnet/index.ts";
import type { NodeInfo } from "../src/tmpnet/types.ts";

import { BOOT_TIMEOUT_MS, TX_TIMEOUT_MS } from "./helpers/constants.ts";
import { waitForCommitted, waitForPChainReady } from "./helpers/wait.ts";

const SKIP_INTEGRATION = process.env.SKIP_INTEGRATION === "true";
const NETWORK_NAME = `e2e-primary-${Date.now()}`;
const EWOQ_PK = `0x${LOCAL_PREFUNDED_KEYS.ewoq.privateKey}` as `0x${string}`;
const EWOQ_C_EVM_ADDR = LOCAL_PREFUNDED_KEYS.ewoq.cChainAddress as `0x${string}`;

interface FlowState {
  tmpnet?: TmpnetManager;
  walletClient?: ReturnType<typeof createAvalancheWalletClient>;
  account?: ReturnType<typeof privateKeyToAvalancheAccount>;
  primaryNodes?: NodeInfo[];
  ownerPAddr?: string;
  ownerCAddr?: string;
}
const state: FlowState = {};

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

describe.skipIf(SKIP_INTEGRATION)("primary network flow against tmpnet", () => {
  beforeAll(async () => {
    state.tmpnet = new TmpnetManager();
    const result = await state.tmpnet.createNetwork(NETWORK_NAME, 5, (msg) =>
      console.log(`[tmpnet] ${msg}`),
    );
    if (!result.success) throw new Error(`Failed to start tmpnet: ${result.error?.message}`);
    state.primaryNodes = result.data?.nodes;

    state.account = privateKeyToAvalancheAccount(EWOQ_PK);
    state.ownerPAddr = state.account.getXPAddress("P", "local");
    // The "C-..." bech32 form encodes the SAME 20-byte secp256k1 pubkey
    // hash as the P-Chain bech32 (NOT the keccak EVM hash). P↔C atomic
    // transfers use this bech32 form for UTXO ownership; the resulting
    // C-Chain credit lands on the corresponding EVM hex address.
    state.ownerCAddr = state.account.getXPAddress("C", "local");
    state.walletClient = createAvalancheWalletClient({
      account: state.account,
      chain: avalancheLocal,
      transport: { type: "http", url: "http://127.0.0.1:9650/" },
    });

    await waitForPChainReady(state.walletClient);
  }, BOOT_TIMEOUT_MS);

  afterAll(async () => {
    if (process.env.KEEP_TMPNET) {
      console.log(`[teardown] KEEP_TMPNET set — leaving network running`);
      return;
    }
    await state.tmpnet?.stopNetwork().catch(() => {});
    await state.tmpnet?.dispose().catch(() => {});
  }, 60_000);

  test("1. tmpnet booted with 5 nodes", () => {
    expect(state.tmpnet).toBeDefined();
    expect(state.primaryNodes?.length).toBe(5);
  });

  // ───────────────────────────────────────────────────────────────────────
  // P ↔ C atomic transfers
  //
  // Avalanche atomic-transfer round-trip:
  //   P-Chain ExportTx → C-Chain atomic memory → C-Chain ImportTx → EVM balance
  //   C-Chain ExportTx → P-Chain atomic memory → P-Chain ImportTx → P UTXO
  //
  // Each direction requires a 5-10s wait between Export and Import so the
  // destination chain's atomic memory has surfaced the new UTXO.
  // ───────────────────────────────────────────────────────────────────────

  test("2. Export P → C via prepareExportTxn", async () => {
    const { walletClient, ownerCAddr } = requireState("walletClient", "ownerCAddr");
    const txnRequest = await walletClient.pChain.prepareExportTxn({
      destinationChain: "C",
      exportedOutputs: [
        {
          // Recipient on C-Chain identified by C-bech32 (same 20 bytes as
          // the P-Chain bech32, different HRP). The Import on C-Chain will
          // convert this to EVM balance for the corresponding hex address.
          addresses: [ownerCAddr],
          amount: 100_000_000n, // 0.1 AVAX in nAvax
        },
      ],
    });
    const { txHash } = await walletClient.sendXPTransaction({
      tx: txnRequest.tx,
      chainAlias: "P",
    });
    await waitForCommitted(walletClient, txHash);
    expect(txHash.length).toBeGreaterThan(0);
    console.log(`[step 2] P→C ExportTx committed: ${txHash}`);
    // Give atomic memory a beat to surface the UTXO on C-Chain.
    await Bun.sleep(5_000);
  }, TX_TIMEOUT_MS);

  test("3. Import on C-Chain (consume P→C export)", async () => {
    const { walletClient } = requireState("walletClient");
    const txnRequest = await walletClient.cChain.prepareImportTxn({
      sourceChain: "P",
      toAddress: EWOQ_C_EVM_ADDR,
    });
    const { txHash } = await walletClient.sendXPTransaction({
      tx: txnRequest.tx,
      chainAlias: "C",
    });
    expect(txHash.length).toBeGreaterThan(0);
    console.log(`[step 3] C-Chain ImportTx (from P) committed: ${txHash}`);
    await Bun.sleep(3_000);
  }, TX_TIMEOUT_MS);

  test("4. Export C → P via cChain.prepareExportTxn", async () => {
    const { walletClient, ownerPAddr } = requireState("walletClient", "ownerPAddr");
    const txnRequest = await walletClient.cChain.prepareExportTxn({
      destinationChain: "P",
      fromAddress: EWOQ_C_EVM_ADDR,
      exportedOutput: {
        addresses: [ownerPAddr],
        amount: 50_000_000n, // 0.05 AVAX in nAvax
      },
    });
    const { txHash } = await walletClient.sendXPTransaction({
      tx: txnRequest.tx,
      chainAlias: "C",
    });
    expect(txHash.length).toBeGreaterThan(0);
    console.log(`[step 4] C→P ExportTx committed: ${txHash}`);
    await Bun.sleep(5_000);
  }, TX_TIMEOUT_MS);

  test("5. Import on P-Chain (consume C→P export)", async () => {
    const { walletClient } = requireState("walletClient");
    const txnRequest = await walletClient.pChain.prepareImportTxn({
      sourceChain: "C",
      importedOutput: {
        addresses: [state.ownerPAddr!],
        threshold: 1,
      },
    });
    const { txHash } = await walletClient.sendXPTransaction({
      tx: txnRequest.tx,
      chainAlias: "P",
    });
    await waitForCommitted(walletClient, txHash);
    expect(txHash.length).toBeGreaterThan(0);
    console.log(`[step 5] P-Chain ImportTx (from C) committed: ${txHash}`);
  }, TX_TIMEOUT_MS);

  // ───────────────────────────────────────────────────────────────────────
  // Primary network staking
  // ───────────────────────────────────────────────────────────────────────

  test("6. AddPermissionlessValidator on primary network", async () => {
    const { walletClient, account } = requireState("walletClient", "account");

    // Generate a brand-new BLS keypair for a never-actually-running
    // validator. We're testing the SDK builds + commits the tx correctly,
    // not the staking lifecycle.
    const blsSecret = new Uint8Array(32);
    crypto.getRandomValues(blsSecret);
    const { bls } = await import("@avalabs/avalanchejs");
    const { bls12_381 } = await import("@noble/curves/bls12-381");
    const sk = bls.secretKeyFromBytes(blsSecret);
    const pk = bls12_381.G1.ProjectivePoint.BASE.multiply(sk);
    const blsPubBytes = bls.publicKeyToBytes(pk);
    const blsPopBytes = bls.signProofOfPossession(blsPubBytes, sk);

    const fakeNodeIdBytes = new Uint8Array(20);
    crypto.getRandomValues(fakeNodeIdBytes);
    const nodeIdB58 = `NodeID-${utils.base58check.encode(fakeNodeIdBytes)}`;

    const ownerPAddr = account.getXPAddress("P", "local");
    const startNow = BigInt(Math.floor(Date.now() / 1000));
    // Local genesis MinStakeDuration is 24h; bump beyond it to clear the
    // floor.
    const endTime = startNow + 25n * 3600n;

    const txnRequest = await walletClient.pChain.prepareAddPermissionlessValidatorTxn({
      // Local genesis MinValidatorStake = 2 * KiloAvax = 2000 AVAX (nAvax).
      stakeInNanoAvax: 2_000_000_000_000n,
      nodeId: nodeIdB58,
      publicKey: `0x${Buffer.from(blsPubBytes).toString("hex")}`,
      signature: `0x${Buffer.from(blsPopBytes).toString("hex")}`,
      end: endTime,
      rewardAddresses: [ownerPAddr],
      delegatorRewardAddresses: [ownerPAddr],
      delegatorRewardPercentage: 2,
    });
    const { txHash } = await walletClient.sendXPTransaction({
      tx: txnRequest.tx,
      chainAlias: "P",
    });
    await waitForCommitted(walletClient, txHash);
    expect(txHash.length).toBeGreaterThan(0);
    console.log(`[step 6] AddPermissionlessValidatorTx committed: ${txHash} (nodeID=${nodeIdB58})`);
  }, TX_TIMEOUT_MS);

  test("7. AddPermissionlessDelegator to an existing primary validator", async () => {
    const { walletClient, account, primaryNodes } = requireState(
      "walletClient",
      "account",
      "primaryNodes",
    );
    const target = primaryNodes[0];
    expect(target).toBeDefined();
    const ownerPAddr = account.getXPAddress("P", "local");
    const startNow = BigInt(Math.floor(Date.now() / 1000));
    const endTime = startNow + 25n * 3600n;

    const txnRequest = await walletClient.pChain.prepareAddPermissionlessDelegatorTxn({
      // Local genesis MinDelegatorStake = 25 AVAX (nAvax).
      stakeInNanoAvax: 25_000_000_000n,
      nodeId: target!.nodeId,
      end: endTime,
      rewardAddresses: [ownerPAddr],
    });
    const { txHash } = await walletClient.sendXPTransaction({
      tx: txnRequest.tx,
      chainAlias: "P",
    });
    await waitForCommitted(walletClient, txHash);
    expect(txHash.length).toBeGreaterThan(0);
    console.log(
      `[step 7] AddPermissionlessDelegatorTx committed: ${txHash} (delegated to ${target!.nodeId})`,
    );
  }, TX_TIMEOUT_MS);

  // ───────────────────────────────────────────────────────────────────────
  // Legacy permissioned-subnet validator (pre-ACP77)
  //
  // Can't exercise this on a converted L1 (conversion is one-way), so we
  // create a fresh subnet specifically for this test and never convert it.
  // ───────────────────────────────────────────────────────────────────────

  test("8. AddSubnetValidator + RemoveSubnetValidator (legacy non-L1 subnet)", async () => {
    const { walletClient, ownerPAddr, primaryNodes } = requireState(
      "walletClient",
      "ownerPAddr",
      "primaryNodes",
    );

    const createSubnet = await walletClient.pChain.prepareCreateSubnetTxn({
      subnetOwners: { addresses: [ownerPAddr], threshold: 1 },
    });
    const { txHash: subnetTx } = await walletClient.sendXPTransaction({
      tx: createSubnet.tx,
      chainAlias: "P",
    });
    await waitForCommitted(walletClient, subnetTx);
    const legacySubnetId = subnetTx;
    console.log(`[step 8] created legacy (non-L1) subnet: ${legacySubnetId}`);

    const target = primaryNodes[1];
    expect(target).toBeDefined();
    const startNow = BigInt(Math.floor(Date.now() / 1000));
    const endTime = startNow + 25n * 3600n;

    const addRequest = await walletClient.pChain.prepareAddSubnetValidatorTxn({
      subnetId: legacySubnetId,
      nodeId: target!.nodeId,
      weight: 100n,
      end: endTime,
      subnetAuth: [0],
    });
    const { txHash: addTx } = await walletClient.sendXPTransaction({
      tx: addRequest.tx,
      chainAlias: "P",
      subnetOwners: addRequest.subnetOwners,
      subnetAuth: addRequest.subnetAuth,
    });
    await waitForCommitted(walletClient, addTx);
    console.log(`[step 8] AddSubnetValidatorTx committed: ${addTx} (${target!.nodeId} → subnet)`);

    const removeRequest = await walletClient.pChain.prepareRemoveSubnetValidatorTxn({
      subnetId: legacySubnetId,
      nodeId: target!.nodeId,
      subnetAuth: [0],
    });
    const { txHash: removeTx } = await walletClient.sendXPTransaction({
      tx: removeRequest.tx,
      chainAlias: "P",
      subnetOwners: removeRequest.subnetOwners,
      subnetAuth: removeRequest.subnetAuth,
    });
    await waitForCommitted(walletClient, removeTx);
    console.log(`[step 8] RemoveSubnetValidatorTx committed: ${removeTx}`);
  }, BOOT_TIMEOUT_MS);
});
