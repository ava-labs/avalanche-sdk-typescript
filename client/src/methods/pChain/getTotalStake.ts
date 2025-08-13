import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import {
  GetTotalStakeParameters,
  GetTotalStakeReturnType,
} from "./types/getTotalStake.js";

/**
 * Get the total stake amount for a subnet.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgettotalstake
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The subnet ID {@link GetTotalStakeParameters}
 * @returns The total stake amount. {@link GetTotalStakeReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getTotalStake } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const totalStake = await getTotalStake(client, {
 *   subnetID: "11111111111111111111111111111111LpoYY"
 * })
 * ```
 */
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
