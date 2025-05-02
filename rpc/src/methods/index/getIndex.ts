import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { IndexRpcSchema } from "./indexRpcSchema.js";
import { GetIndexParameters, GetIndexReturnType } from "./types/getIndex.js";

/**
 * Get the index of a container by its ID.
 *
 * - Docs: https://build.avax.network/docs/api-reference/index-api#indexgetindex
 *
 * @param client - The client to use.
 * @param parameters - The container ID and encoding. {@link GetIndexParameters}
 * @returns The container index. {@link GetIndexReturnType}
 *
 * @example
 * ```ts
 * import { createIndexApiClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getIndex } from '@avalanche-sdk/rpc/methods/index'
 *
 * const client = createIndexApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const index = await getIndex(client, {
 *   id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
 *   encoding: "hex"
 * })
 * ```
 */
export async function getIndex<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetIndexParameters
): Promise<GetIndexReturnType> {
  return client.request<
    IndexRpcSchema,
    { method: "index.getIndex"; params: GetIndexParameters },
    GetIndexReturnType
  >({
    method: "index.getIndex",
    params,
  });
}
