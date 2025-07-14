import { Chain, Client, Transport } from "viem";
import { AvalanchePublicRpcSchema } from "./avalanchePublicRpcSchema.js";
import { MaxPriorityFeePerGasReturnType } from "./types/maxPriorityFeePerGas.js";

/**
 * Get the maximum priority fee per gas for the next block.
 *
 * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#eth_maxpriorityfeepergas
 *
 * @param client - The client to use.
 * @returns The maximum priority fee per gas for the next block. {@link MaxPriorityFeePerGasReturnType}
 *
 * @example
 * ```ts
 * import { createClient, http } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { maxPriorityFeePerGas } from '@avalanche-sdk/client/methods/public'
 *
 * const client = createClient({
 *   chain: avalanche,
 *   transport: http(),
 * })
 *
 * const maxPriorityFeePerGas = await maxPriorityFeePerGas(client)
 * ```
 */
export async function maxPriorityFeePerGas<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<MaxPriorityFeePerGasReturnType> {
  return client.request<
    AvalanchePublicRpcSchema,
    {
      method: "eth_maxPriorityFeePerGas";
      params: [];
    },
    MaxPriorityFeePerGasReturnType
  >({
    method: "eth_maxPriorityFeePerGas",
    params: [],
  });
}
