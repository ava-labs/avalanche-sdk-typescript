import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { HealthRpcSchema } from "./healthRpcSchema.js";
import { HealthParameters, HealthReturnType } from "./types/health.js";

/**
 * Returns the last set of health check results for the node.
 * This includes checks for all chains, network, database, and other components.
 *
 * - Docs: https://build.avax.network/docs/api-reference/health-api#healthhealth
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - Optional tags to filter health checks. {@link HealthParameters}
 * @returns The health check results. {@link HealthReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { health } from '@avalanche-sdk/client/methods/health'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const healthStatus = await health(client, {
 *   tags: ["11111111111111111111111111111111LpoYY", "29uVeLPJB1eQJkzRemU8g8wZDw5uJRqpab5U2mX9euieVwiEbL"]
 * })
 *
 * ```
 */
export async function health<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: HealthParameters
): Promise<HealthReturnType> {
  return client.request<
    HealthRpcSchema,
    { method: "health.health"; params: HealthParameters },
    HealthReturnType
  >({
    method: "health.health",
    params,
  });
}
