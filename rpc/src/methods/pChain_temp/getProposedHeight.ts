import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetProposedHeightReturnType } from "./types/getProposedHeight.js";

/**
 * Get the proposed height of the P-Chain.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetproposedheight
 *
 * @param client - The client to use to make the request
 * @returns The proposed height. {@link GetProposedHeightReturnType}
 *
 * @example
 * ```ts
 * import { createPChainClient} from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getProposedHeight } from '@avalanche-sdk/rpc/methods/pChain'
 *
 * const client = createPChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const proposedHeight = await getProposedHeight(client)
 * ```
 */
export async function getProposedHeight<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetProposedHeightReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getProposedHeight";
      params: {};
    },
    GetProposedHeightReturnType
  >({
    method: "platform.getProposedHeight",
    params: {},
  });
}
