import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetMinStakeParameters, GetMinStakeReturnType } from "./types/getMinStake.js";

export async function getMinStake<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetMinStakeParameters
): Promise<GetMinStakeReturnType> {
  const minStake = await client.request<
    PlatformChainRpcSchema,
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
