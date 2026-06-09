/**
 * ACP-236 auto-renewed validator E2E flow against a tmpnet AvalancheGo network.
 *
 * This test is intentionally opt-in because it requires an AvalancheGo binary
 * with ACP-236 transaction support. Run it with:
 *
 *   RUN_ACP236_INTEGRATION=true \
 *   ACP236_AVALANCHEGO_PATH=/path/to/acp236/avalanchego \
 *   bun test --timeout 600000 ./test/acp236-auto-renewed-validator.integration.test.ts
 *
 * It uses only tmpnet genesis funds and never touches live devnet wallets,
 * private env files, Ledger hardware, or external RPC endpoints.
 */

import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheLocal } from "@avalanche-sdk/client/chains";
import { createAvalancheWalletClient } from "@avalanche-sdk/client";

import { LOCAL_PREFUNDED_KEYS, PLUGIN_DIR } from "../src/tmpnet/constants.ts";
import { TmpnetManager } from "../src/tmpnet/index.ts";
import { finalizeNode, startNewNode } from "../src/tmpnet/node-operations.ts";
import { waitForNode } from "../src/tmpnet/process.ts";

import { BOOT_TIMEOUT_MS, POLL_INTERVAL_MS, TX_TIMEOUT_MS } from "./helpers/constants.ts";
import { waitForCommitted, waitForPChainReady } from "./helpers/wait.ts";

const SKIP_INTEGRATION = process.env.SKIP_INTEGRATION === "true";
const RUN_ACP236_INTEGRATION = process.env.RUN_ACP236_INTEGRATION === "true";
const NETWORK_NAME = `e2e-acp236-${Date.now()}`;
const EWOQ_PK = `0x${LOCAL_PREFUNDED_KEYS.ewoq.privateKey}` as `0x${string}`;
const SETUP_TIMEOUT_MS = 10 * 60_000;

type AvalancheWalletClient = ReturnType<typeof createAvalancheWalletClient>;
type CurrentValidator = Awaited<
  ReturnType<AvalancheWalletClient["pChain"]["getCurrentValidators"]>
>["validators"][number];

interface CandidateNode {
  nodeId: string;
  publicKey: `0x${string}`;
  signature: `0x${string}`;
}

interface FlowState {
  tmpnet?: TmpnetManager;
  walletClient?: AvalancheWalletClient;
  account?: ReturnType<typeof privateKeyToAvalancheAccount>;
  ownerPAddr?: string;
  candidateNode?: CandidateNode;
  nodeId?: string;
  addAutoTxId?: string;
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

async function getNodeProofOfPossession(uri: string): Promise<{
  publicKey: `0x${string}`;
  signature: `0x${string}`;
}> {
  const response = await fetch(`${uri}/ext/info`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "info.getNodeID" }),
  });
  const data = (await response.json()) as {
    result?: { nodePOP?: { publicKey?: string; proofOfPossession?: string } };
  };
  const publicKey = data.result?.nodePOP?.publicKey;
  const signature = data.result?.nodePOP?.proofOfPossession;
  if (!publicKey || !signature) {
    throw new Error(`Node ${uri} did not return a BLS proof of possession`);
  }
  return {
    publicKey: `0x${publicKey.replace(/^0x/, "")}` as `0x${string}`,
    signature: `0x${signature.replace(/^0x/, "")}` as `0x${string}`,
  };
}

function stripPChainPrefix(address: string): string {
  return address.replace(/^P-/, "");
}

async function waitForPChainBootstrapped(
  uri: string,
  label: string,
  timeoutMs = BOOT_TIMEOUT_MS,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastResponse: unknown;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${uri}/ext/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "info.isBootstrapped",
          params: { chain: "P" },
        }),
        signal: AbortSignal.timeout(2_000),
      });
      const data = (await response.json()) as { result?: { isBootstrapped?: boolean } };
      lastResponse = data;
      if (data.result?.isBootstrapped) return;
    } catch (err) {
      lastResponse = err;
    }
    await Bun.sleep(POLL_INTERVAL_MS);
  }

  throw new Error(`Timed out waiting for ${label} P-Chain bootstrap: ${String(lastResponse)}`);
}

async function waitForAutoRenewedValidatorConfig(
  walletClient: AvalancheWalletClient,
  txID: string,
  nodeID: string,
  expectedPeriod: bigint,
  expectedAutoCompoundRewardShares: bigint,
): Promise<CurrentValidator> {
  const deadline = Date.now() + TX_TIMEOUT_MS;
  let lastValidators: CurrentValidator[] = [];

  while (Date.now() < deadline) {
    const { validators } = await walletClient.pChain.getCurrentValidators({ nodeIDs: [nodeID] });
    lastValidators = validators;
    const validator = validators.find((candidate) => candidate.txID === txID);
    if (
      validator?.period === expectedPeriod.toString() &&
      validator.autoCompoundRewardShares === expectedAutoCompoundRewardShares.toString()
    ) {
      return validator;
    }
    await Bun.sleep(POLL_INTERVAL_MS);
  }

  throw new Error(
    `Timed out waiting for ACP-236 validator ${txID} config. Last validators: ${JSON.stringify(
      lastValidators,
    )}`,
  );
}

describe.skipIf(SKIP_INTEGRATION || !RUN_ACP236_INTEGRATION)(
  "ACP-236 auto-renewed validator flow against tmpnet",
  () => {
    beforeAll(async () => {
      state.tmpnet = new TmpnetManager({
        avalanchegoPath: process.env.ACP236_AVALANCHEGO_PATH || undefined,
      });
      const result = await state.tmpnet.createNetwork(NETWORK_NAME, 5, (msg) =>
        console.log(`[tmpnet] ${msg}`),
      );
      if (!result.success) throw new Error(`Failed to start tmpnet: ${result.error?.message}`);
      const network = result.data;
      const bootstrapNode = network?.nodes[0];
      if (!network || !bootstrapNode) throw new Error("Tmpnet did not return a bootstrap node");

      state.account = privateKeyToAvalancheAccount(EWOQ_PK);
      state.ownerPAddr = state.account.getXPAddress("P", "local");
      state.walletClient = createAvalancheWalletClient({
        account: state.account,
        chain: avalancheLocal,
        transport: { type: "http", url: "http://127.0.0.1:9650/ext/bc/C/rpc" },
      });

      await Promise.all(
        network.nodes.map((node) => waitForPChainBootstrapped(node.uri, node.nodeId)),
      );
      await waitForPChainReady(state.walletClient);

      const avalanchegoPath = process.env.ACP236_AVALANCHEGO_PATH;
      if (!avalanchegoPath) {
        throw new Error("ACP236_AVALANCHEGO_PATH is required for ACP-236 tmpnet E2E");
      }
      const bootstrapNodes = network.nodes.map((node) => ({
        nodeId: node.nodeId,
        stakingAddress: node.stakingAddress,
      }));
      const candidate = await startNewNode(
        avalanchegoPath,
        network.networkDir,
        5,
        PLUGIN_DIR,
        bootstrapNodes,
      );
      const candidateReady = await waitForNode(candidate.httpPort, 150, (msg) =>
        console.log(`[candidate] ${msg}`),
      );
      if (!candidateReady.success || !candidateReady.nodeId) {
        throw new Error(candidateReady.error || "Candidate node failed to start");
      }
      const candidateInfo = await finalizeNode(
        candidate.proc,
        candidate.tempDir,
        network.networkDir,
        candidate.httpPort,
        candidate.stakingPort,
        candidate.stakerNum,
        candidateReady.nodeId,
      );
      await waitForPChainBootstrapped(candidateInfo.uri, candidateInfo.nodeId);
      const pop = await getNodeProofOfPossession(candidateInfo.uri);
      state.candidateNode = {
        nodeId: candidateInfo.nodeId,
        publicKey: pop.publicKey,
        signature: pop.signature,
      };
      console.log(`[candidate] non-validator node ready: ${candidateInfo.nodeId}`);
    }, SETUP_TIMEOUT_MS);

    afterAll(async () => {
      if (process.env.KEEP_TMPNET) {
        console.log(`[teardown] KEEP_TMPNET set - leaving network running`);
        return;
      }
      await state.tmpnet?.stopNetwork().catch(() => {});
      await state.tmpnet?.dispose().catch(() => {});
    }, 60_000);

    test("1. tmpnet booted and P-Chain is reachable", () => {
      expect(state.tmpnet).toBeDefined();
      expect(state.walletClient).toBeDefined();
      expect(state.ownerPAddr).toBeDefined();
    });

    test("2. prepare/send AddAutoRenewedValidatorTx and verify current-validator state", async () => {
      const { walletClient, ownerPAddr, candidateNode } = requireState(
        "walletClient",
        "ownerPAddr",
        "candidateNode",
      );
      const { nodeId, publicKey, signature } = candidateNode;
      const stake = 2_000_000_000_000n;
      const period = 25n * 3600n;
      const autoCompoundRewardShares = 1_000_000n;

      const txnRequest = await walletClient.pChain.prepareAddAutoRenewedValidatorTxn({
        changeAddresses: [ownerPAddr],
        stakeInNanoAvax: stake,
        nodeId,
        period,
        rewardAddresses: [ownerPAddr],
        delegatorRewardAddresses: [ownerPAddr],
        ownerAddresses: [ownerPAddr],
        publicKey,
        signature,
        delegatorRewardPercentage: 2,
        autoCompoundRewardPercentage: 100,
      });
      const { txHash } = await walletClient.sendXPTransaction({
        tx: txnRequest.tx,
        chainAlias: txnRequest.chainAlias,
      });
      await waitForCommitted(walletClient, txHash, BOOT_TIMEOUT_MS);

      const validator = await waitForAutoRenewedValidatorConfig(
        walletClient,
        txHash,
        nodeId,
        period,
        autoCompoundRewardShares,
      );

      expect(validator.nodeID).toBe(nodeId);
      expect(validator.weight).toBe(stake.toString());
      expect(validator.validatorAuthority?.threshold).toBe("1");
      expect(validator.validatorAuthority?.addresses.map(stripPChainPrefix)).toEqual([
        stripPChainPrefix(ownerPAddr),
      ]);

      state.nodeId = nodeId;
      state.addAutoTxId = txHash;
      console.log(`[step 2] AddAutoRenewedValidatorTx committed: ${txHash} (${nodeId})`);
    }, BOOT_TIMEOUT_MS);

    test("3. prepare/send SetAutoRenewedValidatorConfigTx using validatorAuthority", async () => {
      const { walletClient, ownerPAddr, nodeId, addAutoTxId } = requireState(
        "walletClient",
        "ownerPAddr",
        "nodeId",
        "addAutoTxId",
      );
      const period = 26n * 3600n;
      const autoCompoundRewardShares = 400_000n;

      const txnRequest = await walletClient.pChain.prepareSetAutoRenewedValidatorConfigTxn({
        changeAddresses: [ownerPAddr],
        validatorTxId: addAutoTxId,
        auth: [0],
        period,
        autoCompoundRewardPercentage: 40,
      });
      const { txHash } = await walletClient.sendXPTransaction({
        tx: txnRequest.tx,
        chainAlias: txnRequest.chainAlias,
        autoRenewedValidatorOwners: txnRequest.autoRenewedValidatorOwners,
        autoRenewedValidatorAuth: txnRequest.autoRenewedValidatorAuth,
      });
      await waitForCommitted(walletClient, txHash, BOOT_TIMEOUT_MS);

      const validator = await waitForAutoRenewedValidatorConfig(
        walletClient,
        addAutoTxId,
        nodeId,
        period,
        autoCompoundRewardShares,
      );

      expect(validator.validatorAuthority?.threshold).toBe("1");
      expect(validator.validatorAuthority?.addresses.map(stripPChainPrefix)).toEqual([
        stripPChainPrefix(ownerPAddr),
      ]);
      console.log(`[step 3] SetAutoRenewedValidatorConfigTx committed: ${txHash}`);
    }, BOOT_TIMEOUT_MS);
  },
);
