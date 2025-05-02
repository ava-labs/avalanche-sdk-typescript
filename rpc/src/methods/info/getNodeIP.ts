import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { GetNodeIPReturnType } from "./types/getNodeIP.js";

/**
 * Get the IP address of this node.
 *
 * - Docs: https://build.avax.network/docs/api-reference/info-api#infogetnodeip
 *
 * @param client - The client to use.
 * @returns The node's IP address. {@link GetNodeIPReturnType}
 *
 * @example
 * ```ts
 * import { createInfoApiClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getNodeIP } from '@avalanche-sdk/rpc/methods/info'
 *
 * const client = createInfoApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
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
