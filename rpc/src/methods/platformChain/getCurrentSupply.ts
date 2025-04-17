import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetCurrentSupplyParameters, GetCurrentSupplyReturnType } from "./types/getCurrentSupply.js";

export async function getCurrentSupply<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetCurrentSupplyParameters
): Promise<GetCurrentSupplyReturnType> {
  const currentSupply = await client.request<
    PlatformChainRpcSchema,
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
