import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { GetTxFeeReturnType } from "./types/getTxFee.js";
import { XChainRpcSchema } from "./xChainRpcSchema.js";

/**
 * Get the transaction fee for a given transaction.
 *
 * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgettxfee
 *
 * @param client - The client to use.
 * @returns The transaction fee. {@link GetTxFeeReturnType}
 *
 * @example
 * ```ts
 * import { createXChainClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getTxFee } from '@avalanche-sdk/rpc/methods/xChain'
 *
 * const client = createXChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * });
 *
 * const txFee = await getTxFee(client);
 */
export async function getTxFee<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetTxFeeReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.getTxFee";
      params: {};
    },
    GetTxFeeReturnType
  >({
    method: "avm.getTxFee",
    params: {},
  });
}
