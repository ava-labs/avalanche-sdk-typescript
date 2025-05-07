import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetTimestampReturnType } from "./types/getTimestamp.js";

/**
 * Get the current timestamp of the P-Chain.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgettimestamp
 *
 * @param client - The client to use to make the request
 * @returns The current timestamp. {@link GetTimestampReturnType}
 *
 * @example
 * ```ts
 * import { createPChainClient} from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getTimestamp } from '@avalanche-sdk/rpc/methods/pChain'
 *
 * const client = createPChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const timestamp = await getTimestamp(client)
 * ```
 */
export async function getTimestamp<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetTimestampReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getTimestamp";
      params: {};
    },
    GetTimestampReturnType
  >({
    method: "platform.getTimestamp",
    params: {},
  });
}
