import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { HealthRpcSchema } from "./healthRpcSchema.js";
import { LivenessReturnType } from "./types/liveness.js";

/**
 * Returns a simple health check indicating if the node is alive and can handle requests.
 * This is a lightweight check that always returns healthy if the endpoint is available.
 *
 * - Docs: https://build.avax.network/docs/api-reference/health-api#healthliveness
 *
 * @param client - The client to use.
 * @returns The liveness check results. {@link LivenessReturnType}
 *
 * @example
 * ```ts
 * import { createHealthApiClient} from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { liveness } from '@avalanche-sdk/rpc/methods/health'
 *
 * const client = createHealthApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
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
