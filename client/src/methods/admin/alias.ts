import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";
import { AliasParameters } from "./types/alias.js";

/**
 * Assign an API endpoint an alias, a different endpoint for the API.
 * The original endpoint will still work. This change only affects this node.
 *
 * - Docs: https://build.avax.network/docs/api-reference/admin-api#adminalias
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The endpoint and alias. {@link AliasParameters}
 * @returns Promise that resolves when the alias is set
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { alias } from '@avalanche-sdk/client/methods/admin'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
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
