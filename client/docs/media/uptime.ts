import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { UptimeReturnType } from "./types/uptime.js";

/**
 * Returns the network's observed uptime of this node.
 * This is the only reliable source of data for your node's uptime.
 *
 * - Docs: https://build.avax.network/docs/api-reference/info-api#infouptime
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns The node's uptime statistics. {@link UptimeReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { uptime } from '@avalanche-sdk/client/methods/info'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const uptime = await uptime(client)
 * ```
 */
export async function uptime<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<UptimeReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.uptime"; params: {} },
    UptimeReturnType
  >({
    method: "info.uptime",
    params: {},
  });
}
