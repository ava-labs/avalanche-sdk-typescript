import { readContract } from "viem/actions";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { erc20ABI } from "../abis/erc20.js";
import {
  GetErc20DecimalsParameters,
  GetErc20DecimalsReturnType,
} from "./types/getErc20Decimals.js";

export async function getErc20Decimals(
  client: AvalancheWalletCoreClient,
  params: GetErc20DecimalsParameters
): Promise<GetErc20DecimalsReturnType> {
  const { contractAddress, abi } = params;

  const decimals = await readContract(client, {
    abi: abi ?? erc20ABI,
    functionName: "decimals",
    address: contractAddress,
  });

  return Number(decimals) as any;
}
