import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetCurrentSupplyParameters, GetCurrentSupplyReturnType } from "./types/getCurrentSupply.js";

export async function getCurrentSupply<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetCurrentSupplyParameters
): Promise<GetCurrentSupplyReturnType> {
  const currentSupply = await client.request<
    PChainRpcSchema,
    {
      method: "platform.getCurrentSupply";
      params: GetCurrentSupplyParameters;
    },
    GetCurrentSupplyReturnType
  >({
    method: "platform.getCurrentSupply",
    params,
  });
  return {
    supply: BigInt(currentSupply.supply),
  };
}
