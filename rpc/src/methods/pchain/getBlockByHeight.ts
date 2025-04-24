import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetBlockByHeightParameters, GetBlockByHeightReturnType } from "./types/getBlockByHeight.js";
/**
 * Retrieves a block from the P-Chain by its height.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetblockbyheight
 *
 * ```ts
 * const block = await getBlockByHeight(client, {
 *   height: 1000001,
 *   encoding: 'hex'
 * });
 * ```
 *
 * @param client - The client instance to use for the request.
 * @param params - The parameters for the request. {@link GetBlockByHeightParameters}
 * @returns The block data at the specified height. {@link GetBlockByHeightReturnType}
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
