import { AvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { getAtomicTxStatus as getCChainTxStatus } from "../cChain/getAtomicTxStatus.js";
import { getTxStatus as getPChainTxStatus } from "../pChain/getTxStatus.js";
import { getTxStatus as getXChainTxStatus } from "../xChain/getTxStatus.js";
import { WaitForTxnParameters } from "./types/waitForTxn.js";

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
