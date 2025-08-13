import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
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
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The chain. {@link GetChainAliasesParameters}
 * @returns The aliases of the chain. {@link GetChainAliasesReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getChainAliases } from '@avalanche-sdk/client/methods/admin'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
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
