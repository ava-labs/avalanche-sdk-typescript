import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { IndexRpcSchema } from "./indexRpcSchema.js";
import {
  GetContainerRangeParameters,
  GetContainerRangeReturnType,
} from "./types/getContainerRange.js";

/**
 * Get a range of containers by their indices.
 *
 * - Docs: https://build.avax.network/docs/api-reference/index-api#indexgetcontainerrange
 *
 * @param client - The client to use.
 * @param parameters - The start index, end index, and encoding. {@link GetContainerRangeParameters}
 * @returns The container details. {@link GetContainerRangeReturnType}
 *
 * @example
 * ```ts
 * import { createIndexApiClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getContainerRange } from '@avalanche-sdk/rpc/methods/index'
 *
 * const client = createIndexApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const containers = await getContainerRange(client, {
 *   startIndex: 0,
 *   endIndex: 10,
 *   encoding: "hex"
 * })
 * ```
 */
export async function getContainerRange<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetContainerRangeParameters
): Promise<GetContainerRangeReturnType> {
  return client.request<
    IndexRpcSchema,
    { method: "index.getContainerRange"; params: GetContainerRangeParameters },
    GetContainerRangeReturnType
  >({
    method: "index.getContainerRange",
    params,
  });
}
