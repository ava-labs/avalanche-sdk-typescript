import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { IndexRpcSchema } from "./indexRpcSchema.js";
import {
  GetContainerByIDParameters,
  GetContainerByIDReturnType,
} from "./types/getContainerByID.js";

/**
 * Get container by ID.
 *
 * - Docs: https://build.avax.network/docs/api-reference/index-api#indexgetcontainerbyid
 *
 * @param client - The client to use.
 * @param parameters - The container ID and encoding. {@link GetContainerByIDParameters}
 * @returns The container details. {@link GetContainerByIDReturnType}
 *
 * @example
 * ```ts
 * import { createIndexApiClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getContainerByID } from '@avalanche-sdk/rpc/methods/index'
 *
 * const client = createIndexApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const container = await getContainerByID(client, {
 *   id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
 *   encoding: "hex"
 * })
 * ```
 */
export async function getContainerByID<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetContainerByIDParameters
): Promise<GetContainerByIDReturnType> {
  return client.request<
    IndexRpcSchema,
    { method: "index.getContainerByID"; params: GetContainerByIDParameters },
    GetContainerByIDReturnType
  >({
    method: "index.getContainerByID",
    params,
  });
}
