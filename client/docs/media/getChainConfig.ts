import { Chain, Client, Transport } from "viem";
import { AvalanchePublicRpcSchema } from "./avalanchePublicRpcSchema.js";
import { GetChainConfigReturnType } from "./types/getChainConfig.js";

/**
 * Get the chain configuration for the C-Chain.
 *
 * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#eth_getchainconfig
 *
 * @param client - The client to use.
 * @returns The chain configuration for the C-Chain. {@link GetChainConfigReturnType}
 *
 * @example
 * ```ts
 * import { createClient, http } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getChainConfig } from '@avalanche-sdk/client/methods/public'
 *
 * const client = createClient({
 *   chain: avalanche,
 *   transport: http(),
 * })
 *
 * const chainConfig = await getChainConfig(client)
 * ```
 */
export async function getChainConfig<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetChainConfigReturnType> {
  return client.request<
    AvalanchePublicRpcSchema,
    {
      method: "eth_getChainConfig";
      params: [];
    },
    GetChainConfigReturnType
  >({
    method: "eth_getChainConfig",
    params: [],
  });
}
