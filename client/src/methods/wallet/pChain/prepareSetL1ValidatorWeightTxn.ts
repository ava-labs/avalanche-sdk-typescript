import { Context, pvm, utils } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "src/clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "src/methods/consts.js";
import { fetchCommonTxParams, getBaseUrl } from "../utils.js";
import {
  PrepareSetL1ValidatorWeightTxnParameters,
  PrepareSetL1ValidatorWeightTxnReturnType,
} from "./types/prepareSetL1ValidatorWeightTxn.js";

export async function prepareSetL1ValidatorWeightTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareSetL1ValidatorWeightTxnParameters
): Promise<PrepareSetL1ValidatorWeightTxnReturnType> {
  const baseUrl = getBaseUrl(client);
  const context = params.context || (await Context.getContextFromURI(baseUrl));
  const { commonTxParams } = await fetchCommonTxParams(client, params);

  const unsignedTx = pvm.newSetL1ValidatorWeightTx(
    {
      ...commonTxParams,
      message: utils.hexToBuffer(params.message),
    },
    context
  );

  return {
    tx: unsignedTx,
    chainAlias: P_CHAIN_ALIAS,
  };
}
