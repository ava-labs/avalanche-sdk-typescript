import { pvm, pvmSerial } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import {
  fetchCommonPVMTxParams,
  formatOutput,
  getChainIdFromAlias,
} from "../utils.js";
import {
  PrepareExportTxnParameters,
  PrepareExportTxnReturnType,
} from "./types/prepareExportTxn.js";

/**
 * Prepares an export transaction for the P-chain.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareExportTxnParameters}
 * @returns The unsigned transaction. {@link PrepareExportTxnReturnType}
 *
 * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-export-tx
 *
 * @example
 * ```ts
 * import { prepareExportTxn } from "@avalanche-sdk/client/methods/wallet/pChain/prepareExportTxn";
 * import { createAvalancheWalletClient } from "@avalanche-sdk/client/clients/createAvalancheWalletClient";
 * import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
 * import { avalanche } from "@avalanche-sdk/client/chains";
 * import { avaxToNanoAvax } from "@avalanche-sdk/client/utils";
 *
 * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890");
 * const walletClient = createAvalancheWalletClient({
 *   account,
 *   chain: avalanche,
 * });
 *
 * const pChainExportTxnRequest = await prepareExportTxn(walletClient, {
 *   destinationChain: "P",
 *   exportedOutputs: [{
 *     addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
 *     amount: avaxToNanoAvax(0.0001),
 *   }],
 * });
 */
export async function prepareExportTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareExportTxnParameters
): Promise<PrepareExportTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams } = await fetchCommonPVMTxParams(client, {
    txParams: params,
    context,
  });

  const exportedOutputs = params.exportedOutputs.map((output) =>
    formatOutput(output, context)
  );

  const unsignedTx = pvm.newExportTx(
    {
      ...commonTxParams,
      outputs: exportedOutputs,
      destinationChainId: getChainIdFromAlias(
        params.destinationChain,
        context.networkID
      ),
    },
    context
  );

  return {
    tx: unsignedTx,
    exportTx: unsignedTx.getTx() as pvmSerial.ExportTx,
    chainAlias: P_CHAIN_ALIAS,
  };
}
