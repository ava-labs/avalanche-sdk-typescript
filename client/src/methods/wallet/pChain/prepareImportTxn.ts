import { pvm, utils } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonTxParams, getChainIdFromAlias } from "../utils.js";
import {
  PrepareImportTxnParameters,
  PrepareImportTxnReturnType,
} from "./types/prepareImportTxn.js";

export async function prepareImportTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareImportTxnParameters
): Promise<PrepareImportTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams } = await fetchCommonTxParams(client, {
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
    chainAlias: P_CHAIN_ALIAS,
  };
}
