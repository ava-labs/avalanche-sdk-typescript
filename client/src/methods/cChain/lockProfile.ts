import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { CChainRpcSchema } from "./cChainRpcSchema.js";

/**
 * Lock the profile.
 *
 * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#adminlockprofile
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns Promise that resolves when the profile is locked
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { lockProfile } from '@avalanche-sdk/client/methods/cChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * await lockProfile(client)
 * ```
 */
export async function lockProfile<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<void> {
  return client.request<
    CChainRpcSchema,
    { method: "admin.lockProfile"; params: {} },
    void
  >({
    method: "admin.lockProfile",
    params: {},
  });
}
