import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { CChainRpcSchema } from "./cChainRpcSchema.js";

/**
 * Start the CPU profiler.
 *
 * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#adminstartcpuprofiler
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns Promise that resolves when the profiler is started
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { startCPUProfiler } from '@avalanche-sdk/rpc/methods/cChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * await startCPUProfiler(client)
 * ```
 */

export async function startCPUProfiler<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<void> {
  return client.request<
    CChainRpcSchema,
    { method: "admin.startCPUProfiler"; params: {} },
    void
  >({
    method: "admin.startCPUProfiler",
    params: {},
  });
}
