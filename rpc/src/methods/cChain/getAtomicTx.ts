import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { CChainRpcSchema } from "./cChainRpcSchema.js";
import {
  GetAtomicTxParameters,
  GetAtomicTxReturnType,
} from "./types/getAtomicTx.js";

/**
 * Get the atomic transaction by its ID.
 *
 * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#avaxgetatomictx
 *
 * @param client - The client to use.
 * @param params - The parameters to use. {@link GetAtomicTxParameters}
 * @returns The atomic transaction. {@link GetAtomicTxReturnType}
 *
 * @example
 * ```ts
 * import { createCChainClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 *
 * const client = createCChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const tx = await getAtomicTx(client, {
 *   txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1"
 * })
 * ```
 */
export async function getAtomicTx<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetAtomicTxParameters
): Promise<GetAtomicTxReturnType> {
  return client.request<
    CChainRpcSchema,
    {
      method: "avax.getAtomicTx";
      params: GetAtomicTxParameters;
    },
    GetAtomicTxReturnType
  >({
    method: "avax.getAtomicTx",
    params: params,
  });
}
