import { pvm } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonTxParams, formatOutput } from "../utils.js";
import {
  PrepareBaseTxnParameters,
  PrepareBaseTxnReturnType,
} from "./types/prepareBaseTxn.js";

export async function prepareBaseTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareBaseTxnParameters
): Promise<PrepareBaseTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams } = await fetchCommonTxParams(client, {
    txParams: params,
    context,
  });

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
