import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetMinStakeParameters, GetMinStakeReturnType } from "./types/getMinStake.js";

export async function getMinStake<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetMinStakeParameters
): Promise<GetMinStakeReturnType> {
  const minStake = await client.request<
    PChainRpcSchema,
    {
      method: "platform.getMinStake";
      params: GetMinStakeParameters;
    },
    GetMinStakeReturnType
  >({
    method: "platform.getMinStake",
    params,
  });
  return {
    minDelegatorStake: BigInt(minStake.minDelegatorStake),
    minValidatorStake: BigInt(minStake.minValidatorStake),
  };
}
