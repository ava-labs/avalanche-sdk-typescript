import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { GetNodeIPReturnType } from "./types/getNodeIP.js";

/**
 * Get the IP address of this node.
 *
 * - Docs: https://build.avax.network/docs/api-reference/info-api#infogetnodeip
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns The node's IP address. {@link GetNodeIPReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getNodeIP } from '@avalanche-sdk/client/methods/info'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const nodeIP = await getNodeIP(client)
 * ```
 */
export async function getNodeIP<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetNodeIPReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.getNodeIP"; params: {} },
    GetNodeIPReturnType
  >({
    method: "info.getNodeIP",
    params: {},
  });
}
