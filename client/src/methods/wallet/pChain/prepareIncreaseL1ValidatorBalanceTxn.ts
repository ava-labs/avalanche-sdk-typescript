import { pvm } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { avaxToNanoAvax, fetchCommonTxParams } from "../utils.js";
import {
  PrepareIncreaseL1ValidatorBalanceTxnParameters,
  PrepareIncreaseL1ValidatorBalanceTxnReturnType,
} from "./types/prepareIncreaseL1ValidatorBalanceTxn.js";

export async function prepareIncreaseL1ValidatorBalanceTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareIncreaseL1ValidatorBalanceTxnParameters
): Promise<PrepareIncreaseL1ValidatorBalanceTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams } = await fetchCommonTxParams(client, {
    txParams: params,
    context,
  });

  const unsignedTx = pvm.newIncreaseL1ValidatorBalanceTx(
    {
      ...commonTxParams,
      balance: avaxToNanoAvax(params.balanceInAvax),
      validationId: params.validationId,
    },
    context
  );

  return {
    tx: unsignedTx,
    chainAlias: P_CHAIN_ALIAS,
  };
}
