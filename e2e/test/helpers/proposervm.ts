import type { PublicClient, WalletClient } from "viem";

async function jsonRpc(
  url: string,
  method: string,
): Promise<{ result?: unknown; error?: unknown }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params: {} }),
      signal: AbortSignal.timeout(3_000),
    });
    return (await res.json()) as { result?: unknown; error?: unknown };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Log the L1's proposerVM PChainHeight + epoch alongside the primary network's
 * P-Chain height. The L1's warp predicate verification uses the *epoch's*
 * frozen PChainHeight (ACP-181) — if that's still 0 while the proposed height
 * has advanced, predicate verification will find an empty validator set and
 * fail silently.
 */
export async function dumpProposerVMHeights(
  nodeUri: string,
  l1BlockchainId: string,
  tag = "proposervm",
): Promise<void> {
  const pChainUrl = `${nodeUri}/ext/bc/P`;
  const proposerVMUrl = `${nodeUri}/ext/bc/${l1BlockchainId}/proposervm`;

  const [pHeight, proposed, epoch] = await Promise.all([
    jsonRpc(pChainUrl, "platform.getHeight"),
    jsonRpc(proposerVMUrl, "proposervm.getProposedHeight"),
    jsonRpc(proposerVMUrl, "proposervm.getCurrentEpoch"),
  ]);
  const dump = (label: string, r: { result?: unknown; error?: unknown }) =>
    console.log(`[${tag}] ${label}: ${JSON.stringify(r.result ?? r.error)}`);
  dump("primary P-Chain height", pHeight);
  dump("L1 proposerVM proposed height", proposed);
  dump("L1 proposerVM current epoch", epoch);
}

/**
 * Roll the L1 past its first ACP-181 epoch.
 *
 * avalanchego v1.14+ implements ACP-181 ("P-Chain epoched views"). Warp
 * predicate verification queries the validator set at the *epoch's* frozen
 * PChainHeight, NOT the block's current proposed height. Epoch 1 starts at
 * the genesis block whose parent has no PChainHeight, so epoch 1's
 * PChainHeight = 0 — and the L1's own subnet has no validators at height 0,
 * so signature verification finds zero signers and reverts with
 * InvalidWarpMessage.
 *
 * Local network's epoch duration is 30s. Sending two cheap warm-up txs
 * separated by 35s causes the L1 to seal epoch 1; the next block lands in
 * epoch 2 and inherits the L1's now-current pChainHeight.
 *
 * @see [[acp181-epoch-trap]]
 */
export async function rollL1PastFirstEpoch(
  walletClient: WalletClient,
  publicClient: PublicClient,
  epochDurationMs = 35_000,
  log: (msg: string) => void = console.log,
): Promise<void> {
  const account = walletClient.account!;
  const send = async (label: string) => {
    log(`rolling L1 past first epoch (${label})...`);
    const hash = await walletClient.sendTransaction({
      to: account.address,
      value: 0n,
      chain: walletClient.chain,
      account,
    } as never);
    await publicClient.waitForTransactionReceipt({ hash });
  };

  await send("warm-up tx 1/2");
  await Bun.sleep(epochDurationMs);
  await send("warm-up tx 2/2");
}
