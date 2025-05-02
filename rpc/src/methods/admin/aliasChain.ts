import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";
import { AliasChainParameters } from "./types/aliasChain.js";

/**
 * Give a blockchain an alias, a different name that can be used any place the blockchain's ID is used.
 * Note: The alias is set for each chain on each node individually.
 *
 * - Docs: https://build.avax.network/docs/api-reference/admin-api#adminaliaschain
 *
 * @param client - The client to use.
 * @param parameters - The chain and alias. {@link AliasChainParameters}
 * @returns Promise that resolves when the chain alias is set
 *
 * @example
 * ```ts
 * import { createAdminApiClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { aliasChain } from '@avalanche-sdk/rpc/methods/admin'
 *
 * const client = createAdminApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * });
 *
 * await aliasChain(client, {
 *   chain: "sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM",
 *   alias: "myBlockchainAlias"
 * });
 * ```
 */
export async function aliasChain<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: AliasChainParameters
): Promise<void> {
  return client.request<
    AdminRpcSchema,
    {
      method: "admin.aliasChain";
      params: AliasChainParameters;
    },
    void
  >({
    method: "admin.aliasChain",
    params: params,
  });
}
