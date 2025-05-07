import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { GetHeightReturnType } from "./types/getHeight.js";
import { XChainRpcSchema } from "./xChainRpcSchema.js";

/**
 * Get the height of the blockchain.
 *
 * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgetheight
 *
 * @param client - The client to use.
 * @returns The height of the blockchain. {@link GetHeightReturnType}
 *
 * @example
 * ```ts
 * import { createXChainClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getHeight } from '@avalanche-sdk/rpc/methods/xChain'
 *
 * const client = createXChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const height = await getHeight(client)
 * ```
 */
export async function getHeight<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetHeightReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.getHeight";
      params: {};
    },
    GetHeightReturnType
  >({
    method: "avm.getHeight",
    params: {},
  });
}
