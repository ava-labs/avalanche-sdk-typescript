import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import {
  GetMinStakeParameters,
  GetMinStakeReturnType,
} from "./types/getMinStake.js";

/**
 * Get the minimum stake amount for a subnet.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetminstake
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The subnet ID {@link GetMinStakeParameters}
 * @returns The minimum stake amount. {@link GetMinStakeReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getMinStake } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const minStake = await getMinStake(client, {
 *   subnetID: "11111111111111111111111111111111LpoYY"
 * })
 * ```
 */
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
