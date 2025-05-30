import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetBlockchainsReturnType } from "./types/getBlockchains.js";

/**
 * Get all the blockchains that exist (excluding the P-Chain).
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetblockchains
 *
 * @param client - The client to use to make the request {@link AvalancheCoreClient}
 * @returns The list of blockchains. {@link GetBlockchainsReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getBlockchains } from '@avalanche-sdk/rpc/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const blockchains = await getBlockchains(client)
 * ```
 */
export async function getBlockchains<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetBlockchainsReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getBlockchains";
      params: {};
    },
    GetBlockchainsReturnType
  >({
    method: "platform.getBlockchains",
    params: {},
  });
}
