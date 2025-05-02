import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";
import {
  GetLoggerLevelParameters,
  GetLoggerLevelReturnType,
} from "./types/getLoggerLevel.js";

/**
 * Returns log and display levels of loggers.
 *
 * - Docs: https://build.avax.network/docs/api-reference/admin-api#admingetloggerlevel
 *
 * @param client - The client to use.
 * @param parameters - The logger name. {@link GetLoggerLevelParameters}
 * @returns The log and display levels of loggers. {@link GetLoggerLevelReturnType}
 *
 * @example
 * ```ts
 * import { createAdminApiClient} from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getLoggerLevel } from '@avalanche-sdk/rpc/methods/admin'
 *
 * const client = createAdminApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * });
 *
 * const loggerLevels = await getLoggerLevel(client, {
 *   loggerName: "C"
 * });
 * ```
 */
export async function getLoggerLevel<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetLoggerLevelParameters
): Promise<GetLoggerLevelReturnType> {
  return client.request<
    AdminRpcSchema,
    {
      method: "admin.getLoggerLevel";
      params: GetLoggerLevelParameters;
    },
    GetLoggerLevelReturnType
  >({
    method: "admin.getLoggerLevel",
    params,
  });
}
