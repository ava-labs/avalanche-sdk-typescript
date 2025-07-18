import { pvm, utils } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { avaxToNanoAvax, fetchCommonTxParams } from "../utils.js";
import {
  PrepareRegisterL1ValidatorTxnParameters,
  PrepareRegisterL1ValidatorTxnReturnType,
} from "./types/prepareRegisterL1ValidatorTxn.js";

export async function prepareRegisterL1ValidatorTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareRegisterL1ValidatorTxnParameters
): Promise<PrepareRegisterL1ValidatorTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams } = await fetchCommonTxParams(client, {
    txParams: params,
    context,
  });

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
