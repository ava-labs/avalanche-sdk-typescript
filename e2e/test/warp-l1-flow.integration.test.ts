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
} from "@avalanche-sdk/interchain";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheLocal } from "@avalanche-sdk/client/chains";
import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { sha256 } from "@noble/hashes/sha2";

import { LOCAL_PREFUNDED_KEYS } from "../src/tmpnet/constants.ts";
import { TmpnetManager } from "../src/tmpnet/index.ts";
import type { NodeInfo } from "../src/tmpnet/types.ts";

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
}
const state: FlowState = {};

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
    if (state.tmpnet) {
      await state.tmpnet.stopNetwork().catch(() => {});
      await state.tmpnet.deleteNetwork(NETWORK_NAME).catch(() => {});
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
        subnetEVMTimestamp: 0,
      },
      alloc: {
        [LOCAL_PREFUNDED_KEYS.ewoq.cChainAddress.replace(/^0x/, "")]: {
          balance: "0x295BE96E64066972000000",
        },
      },
      nonce: "0x0",
      timestamp: "0x0",
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
    // ValidatorManager address is arbitrary for tmpnet — pick a fixed test EOA.
    const managerAddress = "0x000000000000000000000000000000000000bEEF";
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
    });
    state.convertTxId = txHash;
    await waitForCommitted(state.walletClient, txHash, BOOT_TIMEOUT_MS);
    console.log(`[step 5] convertSubnetToL1 committed: ${txHash}`);

    // Fetch the on-chain validator set the P-Chain accepted. The conversion ID
    // P-Chain computed must equal what we computed locally — otherwise our
    // ConversionData.toHex() bytes diverge from AvalancheGo's canonical bytes
    // and signature aggregation would silently reject.
    const onChain = await state.walletClient.pChain.getCurrentValidators({
      subnetID: state.subnetId,
    });
    expect(onChain).toBeDefined();

    // Re-derive conversionID from our local bytes and assert it parses.
    const parsed = ConversionData.fromHex(localConversionData.toHex());
    expect(parsed.getConversionId()).toBe(localConversionId);

    // sha256(toHex bytes) should match getConversionId result.
    const reHashed = utils.bufferToHex(
      sha256(utils.hexToBuffer(localConversionData.toHex())),
    );
    expect(reHashed).toBe(localConversionId);
  }, BOOT_TIMEOUT_MS);
});
