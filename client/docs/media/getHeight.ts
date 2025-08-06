import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetHeightReturnType } from "./types/getHeight.js";

/**
 * Get the height of the last accepted block.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetheight
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns The current height. {@link GetHeightReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getHeight } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
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
    PChainRpcSchema,
    {
      method: "platform.getHeight";
      params: {};
    },
    GetHeightReturnType
  >({
    method: "platform.getHeight",
    params: {},
  });
}
