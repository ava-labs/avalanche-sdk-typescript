import { readContract } from "viem/actions";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { erc20ABI } from "../abis/erc20.js";
import {
  GetErc20NameParameters,
  GetErc20NameReturnType,
} from "./types/getErc20Name.js";

export async function getErc20Name(
  client: AvalancheWalletCoreClient,
  params: GetErc20NameParameters
): Promise<GetErc20NameReturnType> {
  const { contractAddress, abi } = params;

  const name = await readContract(client, {
    abi: abi ?? erc20ABI,
    functionName: "name",
    address: contractAddress,
  });

  return name as any;
}
