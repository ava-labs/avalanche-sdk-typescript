import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";
import { AliasParameters } from "./types/alias.js";

/**
 * Assign an API endpoint an alias, a different endpoint for the API.
 * The original endpoint will still work. This change only affects this node.
 *
 * - Docs: https://build.avax.network/docs/api-reference/admin-api#adminalias
 *
 * @param client - The client to use.
 * @param parameters - The endpoint and alias. {@link AliasParameters}
 * @returns Promise that resolves when the alias is set
 *
 * @example
 * ```ts
 * import { createAdminApiClient} from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { alias } from '@avalanche-sdk/rpc/methods/admin'
 *
 * const client = createAdminApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * });
 *
 * await alias(client, {
 *   endpoint: "bc/X",
 *   alias: "myAlias"
 * });
 * ```
 */
export async function alias<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: AliasParameters
): Promise<void> {
  return client.request<
    AdminRpcSchema,
    {
      method: "admin.alias";
      params: AliasParameters;
    },
    void
  >({
    method: "admin.alias",
    params: params,
  });
}
