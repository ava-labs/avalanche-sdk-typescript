import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import {
  GetRewardUTXOsParameters,
  GetRewardUTXOsReturnType,
} from "./types/getRewardUTXOs.js";

/**
 * Get the reward UTXOs for a transaction.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetrewardutxos
 *
 * @param client - The client to use to make the request
 * @param parameters - The transaction ID and encoding {@link GetRewardUTXOsParameters}
 * @returns The reward UTXOs. {@link GetRewardUTXOsReturnType}
 *
 * @example
 * ```ts
 * import { createPChainClient} from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getRewardUTXOs } from '@avalanche-sdk/rpc/methods/pChain'
 *
 * const client = createPChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const rewardUTXOs = await getRewardUTXOs(client, {
 *   txID: "11111111111111111111111111111111LpoYY",
 *   encoding: "hex"
 * })
 * ```
 */
export async function getRewardUTXOs<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetRewardUTXOsParameters
): Promise<GetRewardUTXOsReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getRewardUTXOs";
      params: GetRewardUTXOsParameters;
    },
    GetRewardUTXOsReturnType
  >({
    method: "platform.getRewardUTXOs",
    params,
  });
}
