import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";
import {
  GetChainAliasesParameters,
  GetChainAliasesReturnType,
} from "./types/getChainAliases.js";

/**
 * Returns the aliases of the chain.
 *
 * - Docs: https://build.avax.network/docs/api-reference/admin-api#admingetchainaliases
 *
 * @param client - The client to use.
 * @param parameters - The chain. {@link GetChainAliasesParameters}
 * @returns The aliases of the chain. {@link GetChainAliasesReturnType}
 *
 * @example
 * ```ts
 * import { createAdminApiClient} from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getChainAliases } from '@avalanche-sdk/rpc/methods/admin'
 *
 * const client = createAdminApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * });
 *
 * const aliases = await getChainAliases(client, {
 *   chain: "sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM"
 * });
 * ```
 */
export async function getChainAliases<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetChainAliasesParameters
): Promise<GetChainAliasesReturnType> {
  return client.request<
    AdminRpcSchema,
    {
      method: "admin.getChainAliases";
      params: GetChainAliasesParameters;
    },
    GetChainAliasesReturnType
  >({
    method: "admin.getChainAliases",
    params,
  });
}
