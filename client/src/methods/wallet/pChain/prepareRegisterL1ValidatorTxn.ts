import { Context, pvm, utils } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "src/clients/createAvalancheWalletCoreClient";
import { P_CHAIN_ALIAS } from "src/methods/consts";
import { avaxToNanoAvax, fetchCommonTxParams, getBaseUrl } from "../utils";
import {
  PrepareRegisterL1ValidatorTxnParameters,
  PrepareRegisterL1ValidatorTxnReturnType,
} from "./types/prepareRegisterL1ValidatorTxn.js";

export async function prepareRegisterL1ValidatorTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareRegisterL1ValidatorTxnParameters
): Promise<PrepareRegisterL1ValidatorTxnReturnType> {
  const baseUrl = getBaseUrl(client);
  const context = params.context || (await Context.getContextFromURI(baseUrl));
  const { commonTxParams } = await fetchCommonTxParams(client, params);

  const unsignedTx = pvm.newRegisterL1ValidatorTx(
    {
      ...commonTxParams,
      balance: avaxToNanoAvax(params.initialBalanceInAvax),
      blsSignature: utils.hexToBuffer(params.blsSignature),
      message: utils.hexToBuffer(params.message),
    },
    context
  );

  return {
    tx: unsignedTx,
    chainAlias: P_CHAIN_ALIAS,
  };
}
