import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
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
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The start index, end index, and encoding. {@link GetContainerRangeParameters}
 * @returns The container details. {@link GetContainerRangeReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getContainerRange } from '@avalanche-sdk/client/methods/index'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
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
