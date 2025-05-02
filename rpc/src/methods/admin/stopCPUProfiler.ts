import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";

/**
 * Stop the CPU profile that was previously started.
 *
 * - Docs: https://build.avax.network/docs/api-reference/admin-api#adminstopcpuprofiler
 *
 * @param client - The client to use.
 * @returns Promise that resolves when the profiler is stopped
 *
 * @example
 * ```ts
 * import { createAdminApiClient} from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { stopCPUProfiler } from '@avalanche-sdk/rpc/methods/admin'
 *
 * const client = createAdminApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * });
 *
 * await stopCPUProfiler(client);
 * ```
 */
export async function stopCPUProfiler<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<void> {
  return client.request<
    AdminRpcSchema,
    {
      method: "admin.stopCPUProfiler";
      params: {};
    },
    void
  >({
    method: "admin.stopCPUProfiler",
    params: {},
  });
}
