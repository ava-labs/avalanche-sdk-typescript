import { waitForTransactionReceipt, writeContract } from "viem/actions";
import { parseAvalancheAccount } from "../../../accounts/utils/parseAvalancheAccount";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient";
import { erc20ABI } from "../abis/erc20";
import {
  ApproveErc20Parameters,
  ApproveErc20ReturnType,
} from "./types/approveErc20";

export async function approveErc20(
  client: AvalancheWalletCoreClient,
  params: ApproveErc20Parameters
): Promise<ApproveErc20ReturnType> {
  const { contractAddress, spender, amount, abi, account } = params;

  const acc = parseAvalancheAccount(account);
  if (!acc && !client.account) {
    throw new Error("no account found");
  }

  const txHash = await writeContract(client, {
    account: acc?.evmAccount,
    abi: abi ?? erc20ABI,
    functionName: "approve",
    args: [spender, amount],
    address: contractAddress,
  } as any);

  const tx = await waitForTransactionReceipt(client, { hash: txHash });

  return {
    status: tx.status,
    txHash,
  };
}
