import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { IssueTxParameters, IssueTxReturnType } from "./types/issueTx.js";
import { XChainRpcSchema } from "./xChainRpcSchema.js";

/**
 * Issue a transaction.
 *
 * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmissuetx
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The transaction to issue. {@link IssueTxParameters}
 * @returns The transaction ID. {@link IssueTxReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { issueTx } from '@avalanche-sdk/client/methods/xChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const tx = await issueTx(client, {
 *   tx: "0x1234567890abcdef"
 * })
 * ```
 */
export async function issueTx<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: IssueTxParameters
): Promise<IssueTxReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.issueTx";
      params: IssueTxParameters;
    },
    IssueTxReturnType
  >({
    method: "avm.issueTx",
    params,
  });
}
