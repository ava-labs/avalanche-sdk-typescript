import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import {
  GetTxStatusParameters,
  GetTxStatusReturnType,
} from "./types/getTxStatus.js";
import { XChainRpcSchema } from "./xChainRpcSchema.js";

/**
 * Get the status of a transaction.
 *
 * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgettxstatus
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The transaction ID. {@link GetTxStatusParameters}
 * @returns The transaction status. {@link GetTxStatusReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getTxStatus } from '@avalanche-sdk/client/methods/xchain'
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
 *   txID: "2QouvMUbQ6tchBHSJdZ7MoFhsQhHt5KqZQqHdZ7MoFhsQhHt5KqZQ"
 * })
 * ```
 */
export async function getTxStatus<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetTxStatusParameters
): Promise<GetTxStatusReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.getTxStatus";
      params: GetTxStatusParameters;
    },
    GetTxStatusReturnType
  >({
    method: "avm.getTxStatus",
    params,
  });
}
