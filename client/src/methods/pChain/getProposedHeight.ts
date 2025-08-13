import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetProposedHeightReturnType } from "./types/getProposedHeight.js";

/**
 * Get the proposed height of the P-Chain.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetproposedheight
 *
 * @param client - The client to use to make the request {@link AvalancheCoreClient}
 * @returns The proposed height. {@link GetProposedHeightReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getProposedHeight } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
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
