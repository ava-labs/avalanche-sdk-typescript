import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { GetNodeIDReturnType } from "./types/getNodeID.js";

/**
 * Get the ID, the BLS key, and the proof of possession of this node.
 * Note: This endpoint is only available on specific nodes, not on public servers.
 *
 * - Docs: https://build.avax.network/docs/api-reference/info-api#infogetnodeid
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns The node ID and BLS key information. {@link GetNodeIDReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getNodeID } from '@avalanche-sdk/client/methods/info'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const nodeInfo = await getNodeID(client)
 * ```
 */
export async function getNodeID<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetNodeIDReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.getNodeID"; params: {} },
    GetNodeIDReturnType
  >({
    method: "info.getNodeID",
    params: {},
  });
}
