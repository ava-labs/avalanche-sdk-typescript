import { readContract } from "viem/actions";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient";
import { erc20ABI } from "../abis/erc20";
import { BalanceOfParameters, BalanceOfReturnType } from "./types/balanceOf";

export async function balanceOf(
  client: AvalancheWalletCoreClient,
  params: BalanceOfParameters
): Promise<BalanceOfReturnType> {
  const { contractAddress, address, abi } = params;

  const balance = await readContract(client, {
    abi: abi ?? erc20ABI,
    functionName: "balanceOf",
    args: [address],
    address: contractAddress,
  } as any);

  return balance as any;
}
