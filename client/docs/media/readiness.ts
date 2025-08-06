import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { HealthRpcSchema } from "./healthRpcSchema.js";
import { ReadinessParameters, ReadinessReturnType } from "./types/readiness.js";

/**
 * Returns the last evaluation of the startup health check results.
 * This indicates if the node has finished initializing and is ready to handle requests.
 *
 * - Docs: https://build.avax.network/docs/api-reference/health-api#healthreadiness
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - Optional tags to filter readiness checks. {@link ReadinessParameters}
 * @returns The readiness check results. {@link ReadinessReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { readiness } from '@avalanche-sdk/client/methods/health'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const readinessStatus = await readiness(client, {
 *   tags: ["11111111111111111111111111111111LpoYY"]
 * })
 * ```
 */
export async function readiness<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: ReadinessParameters
): Promise<ReadinessReturnType> {
  return client.request<
    HealthRpcSchema,
    { method: "health.readiness"; params: ReadinessParameters },
    ReadinessReturnType
  >({
    method: "health.readiness",
    params,
  });
}
