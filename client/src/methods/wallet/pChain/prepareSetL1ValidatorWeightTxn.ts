import { pvm, utils } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonTxParams } from "../utils.js";
import {
  PrepareSetL1ValidatorWeightTxnParameters,
  PrepareSetL1ValidatorWeightTxnReturnType,
} from "./types/prepareSetL1ValidatorWeightTxn.js";

export async function prepareSetL1ValidatorWeightTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareSetL1ValidatorWeightTxnParameters
): Promise<PrepareSetL1ValidatorWeightTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams } = await fetchCommonTxParams(client, {
    txParams: params,
    context,
  });

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
