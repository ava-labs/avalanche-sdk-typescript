import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";

/**
 * Start profiling the CPU utilization of the node.
 * To stop, call `stopCPUProfiler`. On stop, writes the profile to `cpu.profile`.
 *
 * - Docs: https://build.avax.network/docs/api-reference/admin-api#adminstartcpuprofiler
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns Promise that resolves when the profiler is started
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient} from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { startCPUProfiler } from '@avalanche-sdk/client/methods/admin'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * });
 *
 * await startCPUProfiler(client);
 * ```
 */
export async function startCPUProfiler<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<void> {
  return client.request<
    AdminRpcSchema,
    {
      method: "admin.startCPUProfiler";
      params: {};
    },
    void
  >({
    method: "admin.startCPUProfiler",
    params: {},
  });
}
