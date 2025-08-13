import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { GetTxParameters, GetTxReturnType } from "./types/getTx.js";
import { XChainRpcSchema } from "./xChainRpcSchema.js";

/**
 * Get a transaction by its ID.
 *
 * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgettx
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The transaction ID and encoding format. {@link GetTxParameters}
 * @returns The transaction data. {@link GetTxReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getTx } from '@avalanche-sdk/client/methods/xchain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const tx = await getTx(client, {
 *   txID: "2QouvMUbQ6tchBHSJdZ7MoFhsQhHt5KqZQqHdZ7MoFhsQhHt5KqZQ",
 *   encoding: "hex"
 * })
 * ```
 */
export async function getTx<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetTxParameters
): Promise<GetTxReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.getTx";
      params: GetTxParameters;
    },
    GetTxReturnType
  >({
    method: "avm.getTx",
    params,
  });
}
