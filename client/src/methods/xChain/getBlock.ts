import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { GetBlockParameters, GetBlockReturnType } from "./types/getBlock.js";
import { XChainRpcSchema } from "./xChainRpcSchema.js";

/**
 * Get a block by its ID.
 *
 * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgetblock
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The block ID and encoding format. {@link GetBlockParameters}
 * @returns The block data. {@link GetBlockReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getBlock } from '@avalanche-sdk/client/methods/xChain'
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
    XChainRpcSchema,
    {
      method: "avm.getBlock";
      params: GetBlockParameters;
    },
    GetBlockReturnType
  >({
    method: "avm.getBlock",
    params,
  });
}
