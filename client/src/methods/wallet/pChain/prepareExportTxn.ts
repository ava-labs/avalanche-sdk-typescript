import { Context, pvm } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import {
  fetchCommonTxParams,
  formatOutput,
  getBaseUrl,
  getChainIdFromAlias,
} from "../utils.js";
import {
  PrepareExportTxnParameters,
  PrepareExportTxnReturnType,
} from "./types/prepareExportTxn.js";

export async function prepareExportTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareExportTxnParameters
): Promise<PrepareExportTxnReturnType> {
  const { commonTxParams } = await fetchCommonTxParams(client, params);
  const baseUrl = getBaseUrl(client);
  const context = params.context || (await Context.getContextFromURI(baseUrl));

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
    chainAlias: P_CHAIN_ALIAS,
  };
}
