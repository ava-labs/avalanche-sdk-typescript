
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetTotalStakeParameters, GetTotalStakeReturnType } from "./types/getTotalStake.js";

export async function getTotalStake<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetTotalStakeParameters
): Promise<GetTotalStakeReturnType> {
  return client.request<
    PChainRpcSchema,
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