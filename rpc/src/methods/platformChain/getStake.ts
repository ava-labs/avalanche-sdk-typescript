import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetStakeParameters, GetStakeReturnType } from "./types/getStake.js";

export async function getStake<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetStakeParameters
): Promise<GetStakeReturnType> {
  return client.request<
    PlatformChainRpcSchema,
    {
      method: "platform.getStake";
      params: GetStakeParameters;
    },
    GetStakeReturnType
  >({
    method: "platform.getStake",
    params,
  });
}