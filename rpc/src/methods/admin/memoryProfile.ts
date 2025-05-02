import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";

/**
 * Writes a memory profile of the node to `mem.profile`.
 *
 * - Docs: https://build.avax.network/docs/api-reference/admin-api#adminmemoryprofile
 *
 * @param client - The client to use.
 * @returns Promise that resolves when the profile is written
 *
 * @example
 * ```ts
 * import { createAdminApiClient} from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { memoryProfile } from '@avalanche-sdk/rpc/methods/admin'
 *
 * const client = createAdminApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * });
 *
 * await memoryProfile(client);
 * ```
 */
export async function memoryProfile<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<void> {
  return client.request<
    AdminRpcSchema,
    {
      method: "admin.memoryProfile";
      params: {};
    },
    void
  >({
    method: "admin.memoryProfile",
    params: {},
  });
}
