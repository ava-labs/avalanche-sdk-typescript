import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetRewardUTXOsParameters, GetRewardUTXOsReturnType } from "./types/getRewardUTXOs.js";

export async function getRewardUTXOs<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetRewardUTXOsParameters
): Promise<GetRewardUTXOsReturnType> {
  return client.request<
    PChainRpcSchema,
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