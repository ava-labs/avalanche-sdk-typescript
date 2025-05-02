import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { IndexRpcSchema } from "./indexRpcSchema.js";
import {
  GetLastAcceptedParameters,
  GetLastAcceptedReturnType,
} from "./types/getLastAccepted.js";

/**
 * Get the last accepted container.
 *
 * - Docs: https://build.avax.network/docs/api-reference/index-api#indexgetlastaccepted
 *
 * @param client - The client to use.
 * @param parameters - The encoding. {@link GetLastAcceptedParameters}
 * @returns The last accepted container. {@link GetLastAcceptedReturnType}
 *
 * @example
 * ```ts
 * import { createIndexApiClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getLastAccepted } from '@avalanche-sdk/rpc/methods/index'
 *
 * const client = createIndexApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const lastAccepted = await getLastAccepted(client, {
 *   encoding: "hex"
 * })
 * ```
 */
export async function getLastAccepted<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetLastAcceptedParameters
): Promise<GetLastAcceptedReturnType> {
  return client.request<
    IndexRpcSchema,
    { method: "index.getLastAccepted"; params: GetLastAcceptedParameters },
    GetLastAcceptedReturnType
  >({
    method: "index.getLastAccepted",
    params,
  });
}
