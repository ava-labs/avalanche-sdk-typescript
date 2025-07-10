import { readContract } from "viem/actions";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient";
import { erc20ABI } from "../abis/erc20";
import {
  GetErc20SymbolParameters,
  GetErc20SymbolReturnType,
} from "./types/getErc20Symbol";

export async function getErc20Symbol(
  client: AvalancheWalletCoreClient,
  params: GetErc20SymbolParameters
): Promise<GetErc20SymbolReturnType> {
  const { contractAddress, abi } = params;

  const symbol = await readContract(client, {
    abi: abi ?? erc20ABI,
    functionName: "symbol",
    address: contractAddress,
  });

  return symbol as any;
}
