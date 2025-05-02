import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";

/**
 * Writes a profile of mutex statistics to `lock.profile`.
 *
 * - Docs: https://build.avax.network/docs/api-reference/admin-api#adminlockprofile
 *
 * @param client - The client to use.
 * @returns Promise that resolves when the profile is written
 *
 * @example
 * ```ts
 * import { createAdminApiClient} from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { lockProfile } from '@avalanche-sdk/rpc/methods/admin'
 *
 * const client = createAdminApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * });
 *
 * await lockProfile(client);
 * ```
 */
export async function lockProfile<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<void> {
  return client.request<
    AdminRpcSchema,
    {
      method: "admin.lockProfile";
      params: {};
    },
    void
  >({
    method: "admin.lockProfile",
    params: {},
  });
}
