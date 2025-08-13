import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetBlockParameters, GetBlockReturnType } from "./types/getBlock.js";

/**
 * Get a block by its ID.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetblock
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The block ID and encoding format {@link GetBlockParameters}
 * @returns The block data. {@link GetBlockReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getBlock } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const block = await getBlock(client, {
 *   blockID: "d7WYmb8VeZNHsny3EJCwMm6QA37s1EHwMxw1Y71V3FqPZ5EFG",
 *   encoding: "hex"
 * })
 * ```
 */
export async function getBlock<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetBlockParameters
): Promise<GetBlockReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getBlock";
      params: GetBlockParameters;
    },
    GetBlockReturnType
  >({
    method: "platform.getBlock",
    params,
  });
}
