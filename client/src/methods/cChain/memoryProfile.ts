import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { CChainRpcSchema } from "./cChainRpcSchema.js";

/**
 * Get the memory profile.
 *
 * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#adminmemoryprofile
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns Promise that resolves when the memory profile is retrieved
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { memoryProfile } from '@avalanche-sdk/client/methods/cChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * await memoryProfile(client)
 * ```
 */
export async function memoryProfile<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<void> {
  return client.request<
    CChainRpcSchema,
    { method: "admin.memoryProfile"; params: {} },
    void
  >({
    method: "admin.memoryProfile",
    params: {},
  });
}
