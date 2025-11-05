import { avm, avmSerial, utils } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { X_CHAIN_ALIAS } from "../../../methods/consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonAVMTxParams, getChainIdFromAlias } from "../utils.js";
import {
  PrepareImportTxnParameters,
  PrepareImportTxnReturnType,
} from "./types/prepareImportTxn.js";

/**
 * Prepares an import transaction for the X-chain.
 *
 * @see https://build.avax.network/docs/api-reference/x-chain/txn-format#unsigned-importtx
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareImportTxnParameters}
 * @returns The unsigned transaction. {@link PrepareImportTxnReturnType}
 *
 * @example
 * ```ts
 * import { prepareImportTxn } from "@avalanche-sdk/client/methods/wallet/xChain";
 * import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
 * import { avalanche } from "@avalanche-sdk/client/chains";
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
 * const xChainImportTxnRequest = await prepareImportTxn(walletClient, {
 *   sourceChain: "P",
 *   importedOutput: {
 *     addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
 *   },
 * });
 */
export async function prepareImportTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareImportTxnParameters
): Promise<PrepareImportTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams } = await fetchCommonAVMTxParams(client, {
    txParams: params,
    context,
    sourceChain: getChainIdFromAlias(params.sourceChain, context.networkID),
  });

  const unsignedTx = avm.newImportTx(
    context,
    getChainIdFromAlias(params.sourceChain, context.networkID),
    commonTxParams.utxos,
    params.importedOutput.addresses.map(utils.bech32ToBytes),
    commonTxParams.fromAddressesBytes,
    {
      ...(commonTxParams.memo && { memo: commonTxParams.memo }),
      ...(commonTxParams.minIssuanceTime && {
        minIssuanceTime: commonTxParams.minIssuanceTime,
      }),
    },
    params.importedOutput.threshold ?? 1,
    BigInt(params.importedOutput.locktime ?? 0)
  );

  return {
    tx: unsignedTx,
    importTx: unsignedTx.getTx() as avmSerial.ImportTx,
    chainAlias: X_CHAIN_ALIAS,
  };
}
