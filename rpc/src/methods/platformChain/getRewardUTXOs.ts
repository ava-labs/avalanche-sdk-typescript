import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetRewardUTXOsParameters, GetRewardUTXOsReturnType } from "./types/getRewardUTXOs.js";

export async function getRewardUTXOs<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetRewardUTXOsParameters
): Promise<GetRewardUTXOsReturnType> {
  return client.request<
    PlatformChainRpcSchema,
    {
      method: "platform.getRewardUTXOs";
      params: GetRewardUTXOsParameters;
    },
    GetRewardUTXOsReturnType
  >({
    method: "platform.getRewardUTXOs",
    params,
  });
}