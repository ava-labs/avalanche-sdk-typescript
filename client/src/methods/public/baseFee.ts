import { Chain, Client, Transport } from "viem";
import { AvalanchePublicRpcSchema } from "./avalanchePublicRpcSchema.js";
import { BaseFeeReturnType } from "./types/baseFee.js";

/**
 * Get the base fee for the next block.
 *
 * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#eth_basefee
 *
 * @param client - The client to use.
 * @returns The base fee for the next block. {@link BaseFeeReturnType}
 *
 * @example
 * ```ts
 * import { createClient, http } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { baseFee } from '@avalanche-sdk/client/methods/public'
 *
 * const client = createClient({
 *   chain: avalanche,
 *   transport: http(),
 * })
 *
 * const baseFee = await baseFee(client)
 * ```
 */
export async function baseFee<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<BaseFeeReturnType> {
  return client.request<
    AvalanchePublicRpcSchema,
    {
      method: "eth_baseFee";
      params: [];
    },
    BaseFeeReturnType
  >({
    method: "eth_baseFee",
    params: [],
  });
}
