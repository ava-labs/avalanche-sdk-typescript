import { waitForTransactionReceipt, writeContract } from "viem/actions";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient";
import { erc20ABI } from "../abis/erc20";
import {
  TransferErc20Parameters,
  TransferErc20ReturnType,
} from "./types/transferErc20";

export async function transferErc20(
  client: AvalancheWalletCoreClient,
  params: TransferErc20Parameters
): Promise<TransferErc20ReturnType> {
  const { contractAddress, recipient, amount, abi } = params;

  const txHash = await writeContract(client, {
    abi: abi ?? erc20ABI,
    functionName: "transfer",
    args: [recipient, amount],
    address: contractAddress,
  } as any);

  const tx = await waitForTransactionReceipt(client, { hash: txHash });

  return {
    status: tx.status,
    txHash,
  };
}
