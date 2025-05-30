import { readContract } from "viem/actions";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient";
import { erc20ABI } from "../abis/erc20";
import {
  GetErc20NameParameters,
  GetErc20NameReturnType,
} from "./types/getErc20Name";

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
