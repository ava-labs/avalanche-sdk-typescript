
import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetTotalStakeParameters, GetTotalStakeReturnType } from "./types/getTotalStake.js";

export async function getTotalStake<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetTotalStakeParameters
): Promise<GetTotalStakeReturnType> {
  return client.request<
    PlatformChainRpcSchema,
    {
      method: "platform.getTotalStake";
      params: GetTotalStakeParameters;
    },
    GetTotalStakeReturnType
  >({
    method: "platform.getTotalStake",
    params,
  });
}