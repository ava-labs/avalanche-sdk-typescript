import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
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
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The index and encoding. {@link GetContainerByIndexParameters}
 * @returns The container details. {@link GetContainerByIndexReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getContainerByIndex } from '@avalanche-sdk/client/methods/index'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
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
