import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { CChainRpcSchema } from "./cChainRpcSchema.js";
import {
  GetAtomicTxStatusParameters,
  GetAtomicTxStatusReturnType,
} from "./types/getAtomicTxStatus.js";

/**
 * Get the status of an atomic transaction.
 *
 * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#avaxgetatomictxstatus
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The parameters to use. {@link GetAtomicTxStatusParameters}
 * @returns The status of the atomic transaction. {@link GetAtomicTxStatusReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getAtomicTxStatus } from '@avalanche-sdk/client/methods/cChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const status = await getAtomicTxStatus(client, {
 *   txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1"
 * })
 * ```
 */
export async function getAtomicTxStatus<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetAtomicTxStatusParameters
): Promise<GetAtomicTxStatusReturnType> {
  return client.request<
    CChainRpcSchema,
    {
      method: "avax.getAtomicTxStatus";
      params: GetAtomicTxStatusParameters;
    },
    GetAtomicTxStatusReturnType
  >({
    method: "avax.getAtomicTxStatus",
    params,
  });
}
