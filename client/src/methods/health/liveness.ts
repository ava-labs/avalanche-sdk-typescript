import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { HealthRpcSchema } from "./healthRpcSchema.js";
import { LivenessReturnType } from "./types/liveness.js";

/**
 * Returns a simple health check indicating if the node is alive and can handle requests.
 * This is a lightweight check that always returns healthy if the endpoint is available.
 *
 * - Docs: https://build.avax.network/docs/api-reference/health-api#healthliveness
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns The liveness check results. {@link LivenessReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { liveness } from '@avalanche-sdk/client/methods/health'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const livenessStatus = await liveness(client)
 * ```
 */
export async function liveness<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<LivenessReturnType> {
  return client.request<
    HealthRpcSchema,
    { method: "health.liveness"; params: {} },
    LivenessReturnType
  >({
    method: "health.liveness",
    params: {},
  });
}
