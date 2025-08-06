import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { CChainRpcSchema } from "./cChainRpcSchema.js";

/**
 * Stop the CPU profiler.
 *
 * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#adminstopcpuprofiler
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns Promise that resolves when the profiler is stopped
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { stopCPUProfiler } from '@avalanche-sdk/client/methods/cChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * await stopCPUProfiler(client)
 * ```
 */

export async function stopCPUProfiler<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<void> {
  return client.request<
    CChainRpcSchema,
    { method: "admin.stopCPUProfiler"; params: {} },
    void
  >({
    method: "admin.stopCPUProfiler",
    params: {},
  });
}
