import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { GetNodeVersionReturnType } from "./types/getNodeVersion.js";

/**
 * Get the version of this node.
 *
 * - Docs: https://build.avax.network/docs/api-reference/info-api#infogetnodeversion
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns The node's version. {@link GetNodeVersionReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getNodeVersion } from '@avalanche-sdk/client/methods/info'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const nodeVersion = await getNodeVersion(client)
 * ```
 */
export async function getNodeVersion<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetNodeVersionReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.getNodeVersion"; params: {} },
    GetNodeVersionReturnType
  >({
    method: "info.getNodeVersion",
    params: {},
  });
}
