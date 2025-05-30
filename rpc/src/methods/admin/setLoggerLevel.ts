import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";
import { SetLoggerLevelParameters } from "./types/setLoggerLevel.js";

/**
 * Sets log and display levels of loggers.
 *
 * - Docs: https://build.avax.network/docs/api-reference/admin-api#adminsetloggerlevel
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param parameters - The logger name, log level, and display level. {@link SetLoggerLevelParameters}
 * @returns Promise that resolves when the logger levels are set
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { setLoggerLevel } from '@avalanche-sdk/rpc/methods/admin'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * });
 *
 * await setLoggerLevel(client, {
 *   loggerName: "C",
 *   logLevel: "DEBUG",
 *   displayLevel: "INFO"
 * });
 * ```
 */
export async function setLoggerLevel<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: SetLoggerLevelParameters
): Promise<void> {
  return client.request<
    AdminRpcSchema,
    {
      method: "admin.setLoggerLevel";
      params: SetLoggerLevelParameters;
    },
    void
  >({
    method: "admin.setLoggerLevel",
    params,
  });
}
