import { AvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { getAtomicTx as getCChainAtomicTx } from "../cChain/getAtomicTx.js";
import { getTxStatus as getPChainTxStatus } from "../pChain/getTxStatus.js";
import { getTxStatus as getXChainTxStatus } from "../xChain/getTxStatus.js";
import { WaitForTxnParameters } from "./types/waitForTxn.js";

// `avax.getAtomicTxStatus` is deprecated and unavailable after Helicon.
// Use `avax.getAtomicTx` instead: the tx is accepted once `blockHeight` is set.
// Unknown txs return "not found" (SAE) or "could not find tx" (coreth).
async function getCChainTxStatus(
  client: AvalancheWalletCoreClient["cChainClient"],
  args: { txID: string }
): Promise<{ status: string }> {
  try {
    const { blockHeight } = await getCChainAtomicTx(client, args);
    return { status: blockHeight ? "Accepted" : "Processing" };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = (error as { status?: number })?.status;
    if (/not found|could not find/i.test(message) || status === 429) {
      return { status: "Unknown" };
    }
    throw error;
  }
}

export async function waitForTxn(
  client: AvalancheWalletCoreClient,
  params: WaitForTxnParameters
): Promise<void> {
  let { txHash, chainAlias, sleepTime = 300, maxRetries = 10 } = params;
  const getTxStatus = (args: { txID: string }) =>
    chainAlias === "P"
      ? getPChainTxStatus(client.pChainClient, args)
      : chainAlias === "X"
      ? getXChainTxStatus(client.xChainClient, args)
      : getCChainTxStatus(client.cChainClient, args);

  while (maxRetries > 0) {
    const txStatus = await getTxStatus({ txID: txHash });
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

  throw new Error(`Transaction status not found`);
}
