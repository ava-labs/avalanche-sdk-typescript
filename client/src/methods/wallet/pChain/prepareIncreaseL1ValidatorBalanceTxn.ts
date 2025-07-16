import { Context, pvm } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "src/clients/createAvalancheWalletCoreClient";
import { P_CHAIN_ALIAS } from "src/methods/consts";
import { avaxToNanoAvax, fetchCommonTxParams, getBaseUrl } from "../utils";
import {
  PrepareIncreaseL1ValidatorBalanceTxnParameters,
  PrepareIncreaseL1ValidatorBalanceTxnReturnType,
} from "./types/prepareIncreaseL1ValidatorBalanceTxn.js";

export async function prepareIncreaseL1ValidatorBalanceTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareIncreaseL1ValidatorBalanceTxnParameters
): Promise<PrepareIncreaseL1ValidatorBalanceTxnReturnType> {
  const baseUrl = getBaseUrl(client);
  const context = params.context || (await Context.getContextFromURI(baseUrl));
  const { commonTxParams } = await fetchCommonTxParams(client, params);

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
