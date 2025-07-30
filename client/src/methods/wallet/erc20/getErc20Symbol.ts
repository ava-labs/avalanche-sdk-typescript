import { readContract } from "viem/actions";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { erc20ABI } from "../abis/erc20.js";
import {
  GetErc20SymbolParameters,
  GetErc20SymbolReturnType,
} from "./types/getErc20Symbol.js";

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
