import { Context, pvm } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { fetchCommonTxParams, formatOutput, getBaseUrl } from "../utils.js";
import {
  PrepareBaseTxnParameters,
  PrepareBaseTxnReturnType,
} from "./types/prepareBaseTxn.js";

export async function prepareBaseTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareBaseTxnParameters
): Promise<PrepareBaseTxnReturnType> {
  const { commonTxParams } = await fetchCommonTxParams(client, params);
  const baseUrl = getBaseUrl(client);
  const context = params.context || (await Context.getContextFromURI(baseUrl));

  // Format outputs as per AvalancheJS
  const formattedOutputs = params.outputs
    ? params.outputs.map((output) => formatOutput(output, context))
    : [];

  const unsignedTx = pvm.newBaseTx(
    {
      ...commonTxParams,
      outputs: formattedOutputs,
    },
    context
  );

  return {
    tx: unsignedTx,
    chainAlias: P_CHAIN_ALIAS,
  };
}
