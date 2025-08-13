import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetTxParameters, GetTxReturnType } from "./types/getTx.js";

/**
 * Get a transaction by its ID.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgettx
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The transaction ID and encoding {@link GetTxParameters}
 * @returns The transaction data. {@link GetTxReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getTx } from '@avalanche-sdk/client/methods/pChain'
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
 *   txID: "11111111111111111111111111111111LpoYY",
 *   encoding: "hex"
 * })
 * ```
 */
export async function getTx<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetTxParameters
): Promise<GetTxReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getTx";
      params: GetTxParameters;
    },
    GetTxReturnType
  >({
    method: "platform.getTx",
    params,
  });
}
