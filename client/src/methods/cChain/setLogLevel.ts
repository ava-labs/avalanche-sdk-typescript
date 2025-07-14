import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { CChainRpcSchema } from "./cChainRpcSchema.js";
import { SetLogLevelParameters } from "./types/setLogLevel.js";

/**
 * Set the log level.
 *
 * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#adminsetloglevel
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The parameters to use. {@link SetLogLevelParameters}
 * @returns Promise that resolves when the log level is set
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { setLogLevel } from '@avalanche-sdk/client/methods/cChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * await setLogLevel(client, {
 *   level: "info"
 * })
 * ```
 */
export async function setLogLevel<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: SetLogLevelParameters
): Promise<void> {
  return client.request<
    CChainRpcSchema,
    { method: "admin.setLogLevel"; params: SetLogLevelParameters },
    void
  >({
    method: "admin.setLogLevel",
    params: params,
  });
}
