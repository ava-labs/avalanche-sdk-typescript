import { avm, avmSerial } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { X_CHAIN_ALIAS } from "../../../methods/consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import {
  fetchCommonAVMTxParams,
  formatOutput,
  getChainIdFromAlias,
} from "../utils.js";
import {
  PrepareExportTxnParameters,
  PrepareExportTxnReturnType,
} from "./types/prepareExportTxn.js";

/**
 * Prepares an export transaction for the X-chain.
 *
 * @see https://build.avax.network/docs/api-reference/x-chain/txn-format#unsigned-exporttx
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareExportTxnParameters}
 * @returns The unsigned transaction. {@link PrepareExportTxnReturnType}
 *
 * @example
 * ```ts
 * import { prepareExportTxn } from "@avalanche-sdk/client/methods/wallet/xChain";
 * import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
 * import { avalanche } from "@avalanche-sdk/client/chains";
 * import { avaxToNanoAvax } from "@avalanche-sdk/client/utils";
 *
 * const account = privateKeyToAvalancheAccount(privateKeyForTest);
 * const walletClient = new AvalancheWalletCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     url: "https://api.avax.network/ext/bc/C/rpc",
 *   },
 *   account,
 * });
 *
 * const xChainExportTxnRequest = await prepareExportTxn(walletClient, {
 *   destinationChain: "P",
 *   exportedOutputs: [
 *     {
 *       amount: avaxToNanoAvax(0.0001), // 0.0001 AVAX = 100_000 nAVAX
 *       to: "P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz",
 *     },
 *   ],
 * });
 */
export async function prepareExportTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareExportTxnParameters
): Promise<PrepareExportTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams } = await fetchCommonAVMTxParams(client, {
    txParams: params,
    context,
  });
  const exportedOutputs = params.exportedOutputs.map((output) =>
    formatOutput(output, context)
  );

  const unsignedTx = avm.newExportTx(
    context,
    getChainIdFromAlias(params.destinationChain, context.networkID),
    commonTxParams.fromAddressesBytes,
    commonTxParams.utxos,
    exportedOutputs,
    {
      ...(commonTxParams.changeAddressesBytes && {
        changeAddresses: commonTxParams.changeAddressesBytes,
      }),
      ...(commonTxParams.minIssuanceTime && {
        minIssuanceTime: commonTxParams.minIssuanceTime,
      }),
      ...(commonTxParams.memo && { memo: commonTxParams.memo }),
    }
  );

  return {
    tx: unsignedTx,
    exportTx: unsignedTx.getTx() as avmSerial.ExportTx,
    chainAlias: X_CHAIN_ALIAS,
  };
}
