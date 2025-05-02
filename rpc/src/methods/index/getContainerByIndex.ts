import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { IndexRpcSchema } from "./indexRpcSchema.js";
import {
  GetContainerByIndexParameters,
  GetContainerByIndexReturnType,
} from "./types/getContainerByIndex.js";

/**
 * Get container by index.
 *
 * - Docs: https://build.avax.network/docs/api-reference/index-api#indexgetcontainerbyindex
 *
 * @param client - The client to use.
 * @param parameters - The index and encoding. {@link GetContainerByIndexParameters}
 * @returns The container details. {@link GetContainerByIndexReturnType}
 *
 * @example
 * ```ts
 * import { createIndexApiClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getContainerByIndex } from '@avalanche-sdk/rpc/methods/index'
 *
 * const client = createIndexApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const container = await getContainerByIndex(client, {
 *   index: 1,
 *   encoding: "hex"
 * })
 * ```
 */
export async function getContainerByIndex<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetContainerByIndexParameters
): Promise<GetContainerByIndexReturnType> {
  return client.request<
    IndexRpcSchema,
    {
      method: "index.getContainerByIndex";
      params: GetContainerByIndexParameters;
    },
    GetContainerByIndexReturnType
  >({
    method: "index.getContainerByIndex",
    params,
  });
}
