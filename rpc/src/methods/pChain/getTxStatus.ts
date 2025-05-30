import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import {
  GetTxStatusParameters,
  GetTxStatusReturnType,
} from "./types/getTxStatus.js";

/**
 * Get the status of a transaction.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgettxstatus
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param parameters - The transaction ID {@link GetTxStatusParameters}
 * @returns The transaction status. {@link GetTxStatusReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getTxStatus } from '@avalanche-sdk/rpc/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const status = await getTxStatus(client, {
 *   txID: "11111111111111111111111111111111LpoYY"
 * })
 * ```
 */
export async function getTxStatus<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetTxStatusParameters
): Promise<GetTxStatusReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getTxStatus";
      params: GetTxStatusParameters;
    },
    GetTxStatusReturnType
  >({
    method: "platform.getTxStatus",
    params,
  });
}
