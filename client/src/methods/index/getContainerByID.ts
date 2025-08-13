import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
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
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The container ID and encoding. {@link GetContainerByIDParameters}
 * @returns The container details. {@link GetContainerByIDReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getContainerByID } from '@avalanche-sdk/client/methods/index'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
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
