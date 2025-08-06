import { pvm, pvmSerial, utils } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonPVMTxParams, getChainIdFromAlias } from "../utils.js";
import {
  PrepareImportTxnParameters,
  PrepareImportTxnReturnType,
} from "./types/prepareImportTxn.js";

/**
 * Prepares an import transaction for the P-chain.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareImportTxnParameters}
 * @returns The unsigned transaction. {@link PrepareImportTxnReturnType}
 *
 * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-import-tx
 *
 * @example
 * ```ts
 * import { prepareImportTxn } from "@avalanche-sdk/client/methods/wallet/pChain/prepareImportTxn";
 * import { createAvalancheWalletClient } from "@avalanche-sdk/client/clients/createAvalancheWalletClient";
 * import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
 * import { avalanche } from "@avalanche-sdk/client/chains";
 *
 * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890");
 * const walletClient = createAvalancheWalletClient({
 *   account,
 *   chain: avalanche,
 * });
 *
 * const pChainImportTxnRequest = await prepareImportTxn(walletClient, {
 *   sourceChain: "C",
 *   importedOutput: {
 *     addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
 *   },
 * });
 *
 * console.log(pChainImportTxnRequest);
 * ```
 */
export async function prepareImportTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareImportTxnParameters
): Promise<PrepareImportTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams } = await fetchCommonPVMTxParams(client, {
    txParams: params,
    context,
    sourceChain: getChainIdFromAlias(params.sourceChain, context.networkID),
  });

  const unsignedTx = pvm.newImportTx(
    {
      ...commonTxParams,
      sourceChainId: getChainIdFromAlias(params.sourceChain, context.networkID),
      toAddressesBytes: params.importedOutput.addresses.map(
        utils.bech32ToBytes
      ),
      locktime: BigInt(params.importedOutput.locktime ?? 0),
      threshold: params.importedOutput.threshold ?? 1,
    },
    context
  );

  return {
    tx: unsignedTx,
    importTx: unsignedTx.getTx() as pvmSerial.ImportTx,
    chainAlias: P_CHAIN_ALIAS,
  };
}
