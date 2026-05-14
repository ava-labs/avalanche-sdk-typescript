import { createAvalancheWalletClient } from "@avalanche-sdk/client";

import { POLL_INTERVAL_MS, TX_TIMEOUT_MS, BOOT_TIMEOUT_MS } from "./constants.ts";

type AvalancheWalletClient = ReturnType<typeof createAvalancheWalletClient>;

/** Poll P-Chain getTxStatus until "Committed" or timeout. */
export async function waitForCommitted(
  walletClient: AvalancheWalletClient,
  txID: string,
  timeoutMs = TX_TIMEOUT_MS,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const { status } = await walletClient.pChain.getTxStatus({ txID });
      if (status === "Committed") return;
      if (status === "Dropped") throw new Error(`Tx ${txID} was dropped`);
    } catch (err) {
      if (Date.now() > deadline - 1000) throw err;
    }
    await Bun.sleep(POLL_INTERVAL_MS);
  }
  throw new Error(`Timed out waiting for tx ${txID} to commit`);
}

/** Wait for P-Chain to accept getHeight (bootstrap proxy). */
export async function waitForPChainReady(
  walletClient: AvalancheWalletClient,
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
export async function waitForL1EvmReady(
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
        const data = (await res.json()) as { result?: string };
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

/**
 * Wait until P-Chain `getCurrentValidators(subnetID)` reports at least one
 * validator. After ConvertSubnetToL1Tx commits, the L1 validator takes a
 * few seconds to appear in P-Chain's subnet validator set query — without
 * this wait, sig-aggregator finds 0 signers and never converges.
 */
export async function waitForL1ValidatorRegistered(
  walletClient: AvalancheWalletClient,
  subnetID: string,
  timeoutMs = 60_000,
): Promise<number> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const current = await walletClient.pChain.getCurrentValidators({ subnetID });
      const list = (current as { validators?: unknown[] })?.validators ?? [];
      if (list.length > 0) return list.length;
    } catch {
      // try again
    }
    await Bun.sleep(2_000);
  }
  throw new Error(`Timed out waiting for L1 validator on subnet ${subnetID}`);
}
