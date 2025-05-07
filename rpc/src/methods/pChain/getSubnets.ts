import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import {
  GetSubnetsParameters,
  GetSubnetsReturnType,
} from "./types/getSubnets.js";

/**
 * Get all subnets.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetsubnets
 *
 * @param client - The client to use to make the request
 * @param parameters - Optional parameters {@link GetSubnetsParameters}
 * @returns The list of subnets. {@link GetSubnetsReturnType}
 *
 * @example
 * ```ts
 * import { createPChainClient} from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getSubnets } from '@avalanche-sdk/rpc/methods/pChain'
 *
 * const client = createPChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const subnets = await getSubnets(client, {})
 * ```
 */
export async function getSubnets<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetSubnetsParameters
): Promise<GetSubnetsReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getSubnets";
      params: GetSubnetsParameters;
    },
    GetSubnetsReturnType
  >({
    method: "platform.getSubnets",
    params,
  });
}
