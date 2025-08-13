import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetTimestampReturnType } from "./types/getTimestamp.js";

/**
 * Get the current timestamp of the P-Chain.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgettimestamp
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns The current timestamp. {@link GetTimestampReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getTimestamp } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
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
