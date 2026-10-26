import { AvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { getAtomicTx as getCChainAtomicTx } from "../cChain/getAtomicTx.js";
import { getTxStatus as getPChainTxStatus } from "../pChain/getTxStatus.js";
import { getTx as getXChainTx } from "../xChain/getTx.js";
import { WaitForTxnParameters } from "./types/waitForTxn.js";

// Unknown txs return "not found" (AvalancheGo, SAE) or "could not find tx"
// (coreth). HTTP 429 is a rate limit. Keep polling on all of these.
// Other HTTP errors (for example 404 from a wrong URL) are not a missing tx.
function isTxNotFoundYet(error: unknown): boolean {
  const { status, details } = (error ?? {}) as {
    status?: number;
    details?: string;
  };
  if (status !== undefined) {
    return status === 429;
  }
  // viem puts the RPC error message in `details`
  const message =
    details ?? (error instanceof Error ? error.message : String(error));
  return /not found|could not find/i.test(message);
}

type TxStatus = { status: string; error?: unknown };

// `avax.getAtomicTxStatus` is deprecated and unavailable after Helicon.
// Use `avax.getAtomicTx` instead: the tx is accepted once `blockHeight` is set.
async function getCChainTxStatus(
  client: AvalancheWalletCoreClient["cChainClient"],
  args: { txID: string }
): Promise<TxStatus> {
  try {
    const { blockHeight } = await getCChainAtomicTx(client, args);
    return { status: blockHeight ? "Accepted" : "Processing" };
  } catch (error) {
    if (isTxNotFoundYet(error)) {
      return { status: "Unknown", error };
    }
    throw error;
  }
}

// `avm.getTxStatus` is deprecated. Use `avm.getTx` instead: the X-Chain
// returns a tx only after it is accepted, so a result means accepted.
async function getXChainTxStatus(
  client: AvalancheWalletCoreClient["xChainClient"],
  args: { txID: string }
): Promise<TxStatus> {
  try {
    await getXChainTx(client, { txID: args.txID, encoding: "hex" });
    return { status: "Accepted" };
  } catch (error) {
    if (isTxNotFoundYet(error)) {
      return { status: "Unknown", error };
    }
    throw error;
  }
}

export async function waitForTxn(
  client: AvalancheWalletCoreClient,
  params: WaitForTxnParameters
): Promise<void> {
  let { txHash, chainAlias, sleepTime = 300, maxRetries = 10 } = params;
  const getTxStatus = (args: { txID: string }): Promise<TxStatus> =>
    chainAlias === "P"
      ? getPChainTxStatus(client.pChainClient, args)
      : chainAlias === "X"
      ? getXChainTxStatus(client.xChainClient, args)
      : getCChainTxStatus(client.cChainClient, args);

  // The last error that polling ignored, for example a rate limit
  let lastError: unknown;
  while (maxRetries > 0) {
    const txStatus = await getTxStatus({ txID: txHash });
    if (txStatus.error !== undefined) {
      lastError = txStatus.error;
    }
    if (["Accepted", "Committed"].includes(txStatus.status)) {
      return;
    } else if (["Rejected", "Dropped"].includes(txStatus.status)) {
      throw new Error(
        `Transaction ${txHash} rejected with status ${txStatus.status}`
      );
    }
    maxRetries--;
    await new Promise((resolve) => setTimeout(resolve, sleepTime));
  }

  throw new Error(
    `Transaction status not found`,
    lastError === undefined ? undefined : { cause: lastError }
  );
}
