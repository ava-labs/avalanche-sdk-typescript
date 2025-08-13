import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
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
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The block height and encoding format. {@link GetBlockByHeightParameters}
 * @returns The block data. {@link GetBlockByHeightReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getBlockByHeight } from '@avalanche-sdk/client/methods/xChain'
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
