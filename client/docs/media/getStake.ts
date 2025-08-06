import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetStakeParameters, GetStakeReturnType } from "./types/getStake.js";

/**
 * Get the stake amount for a set of addresses.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetstake
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The addresses and subnet ID {@link GetStakeParameters}
 * @returns The stake amount. {@link GetStakeReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getStake } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const stake = await getStake(client, {
 *   addresses: ["P-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p"],
 *   subnetID: "11111111111111111111111111111111LpoYY"
 * })
 * ```
 */
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
