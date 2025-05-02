import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import {
  GetBlockByHeightParameters,
  GetBlockByHeightReturnType,
} from "./types/getBlockByHeight.js";
import { XChainRpcSchema } from "./xChainRpcSchema.js";

/**
 * Get a block by its height.
 *
 * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgetblockbyheight
 *
 * @param client - The client to use.
 * @param parameters - The block height and encoding format. {@link GetBlockByHeightParameters}
 * @returns The block data. {@link GetBlockByHeightReturnType}
 *
 * @example
 * ```ts
 * import { createXChainClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getBlockByHeight } from '@avalanche-sdk/rpc/methods/xChain'
 *
 * const client = createXChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
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
    XChainRpcSchema,
    {
      method: "avm.getBlockByHeight";
      params: GetBlockByHeightParameters;
    },
    GetBlockByHeightReturnType
  >({
    method: "avm.getBlockByHeight",
    params,
  });
}
