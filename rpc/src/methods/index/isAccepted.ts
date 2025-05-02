import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { IndexRpcSchema } from "./indexRpcSchema.js";
import {
  IsAcceptedParameters,
  IsAcceptedReturnType,
} from "./types/isAccepted.js";

/**
 * Check if a container is accepted.
 *
 * - Docs: https://build.avax.network/docs/api-reference/index-api#indexisaccepted
 *
 * @param client - The client to use.
 * @param parameters - The container ID and encoding. {@link IsAcceptedParameters}
 * @returns Whether the container is accepted. {@link IsAcceptedReturnType}
 *
 * @example
 * ```ts
 * import { createIndexApiClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { isAccepted } from '@avalanche-sdk/rpc/methods/index'
 *
 * const client = createIndexApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const accepted = await isAccepted(client, {
 *   id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
 *   encoding: "hex"
 * })
 * ```
 */
export async function isAccepted<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: IsAcceptedParameters
): Promise<IsAcceptedReturnType> {
  return client.request<
    IndexRpcSchema,
    { method: "index.isAccepted"; params: IsAcceptedParameters },
    IsAcceptedReturnType
  >({
    method: "index.isAccepted",
    params,
  });
}
