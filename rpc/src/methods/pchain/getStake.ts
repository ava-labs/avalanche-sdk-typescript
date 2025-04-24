import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetStakeParameters, GetStakeReturnType } from "./types/getStake.js";

export async function getStake<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetStakeParameters
): Promise<GetStakeReturnType> {
  return client.request<
    PChainRpcSchema,
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