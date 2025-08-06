import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { GetTxFeeReturnType } from "./types/getTxFee.js";

/**
 * Get the transaction fee for this node.
 *
 * - Docs: https://build.avax.network/docs/api-reference/info-api#infogettxfee
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns The transaction fee. {@link GetTxFeeReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getTxFee } from '@avalanche-sdk/client/methods/info'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const txFee = await getTxFee(client)
 * ```
 */
export async function getTxFee<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetTxFeeReturnType> {
  const txFee = await client.request<
    InfoRpcSchema,
    { method: "info.getTxFee"; params: {} },
    GetTxFeeReturnType
  >({
    method: "info.getTxFee",
    params: {},
  });
  return {
    txFee: BigInt(txFee.txFee),
    createAssetTxFee: BigInt(txFee.createAssetTxFee),
    createSubnetTxFee: BigInt(txFee.createSubnetTxFee),
    transformSubnetTxFee: BigInt(txFee.transformSubnetTxFee),
    createBlockchainTxFee: BigInt(txFee.createBlockchainTxFee),
    addPrimaryNetworkValidatorFee: BigInt(txFee.addPrimaryNetworkValidatorFee),
    addPrimaryNetworkDelegatorFee: BigInt(txFee.addPrimaryNetworkDelegatorFee),
    addSubnetValidatorFee: BigInt(txFee.addSubnetValidatorFee),
    addSubnetDelegatorFee: BigInt(txFee.addSubnetDelegatorFee),
  };
}
