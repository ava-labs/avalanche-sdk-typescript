import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import {
  GetBlockByHeightParameters,
  GetBlockByHeightReturnType,
} from "./types/getBlockByHeight.js";

/**
 * Get a block by its height.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetblockbyheight
 *
 * @param client - The client to use to make the request {@link AvalancheCoreClient}
 * @param params - The block height and encoding format {@link GetBlockByHeightParameters}
 * @returns The block data. {@link GetBlockByHeightReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getBlockByHeight } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const block = await getBlockByHeight(client, {
 *   height: 1000001,
 *   encoding: "hex"
 * })
 * ```
 */
export async function getBlockByHeight<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetBlockByHeightParameters
): Promise<GetBlockByHeightReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getBlockByHeight";
      params: GetBlockByHeightParameters;
    },
    GetBlockByHeightReturnType
  >({
    method: "platform.getBlockByHeight",
    params,
  });
}
