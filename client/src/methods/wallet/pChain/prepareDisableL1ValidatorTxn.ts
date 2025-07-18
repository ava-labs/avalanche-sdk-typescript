import { pvm, pvmSerial } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonTxParams } from "../utils.js";
import {
  PrepareDisableL1ValidatorTxnParameters,
  PrepareDisableL1ValidatorTxnReturnType,
} from "./types/prepareDisableL1ValidatorTxn.js";

export async function prepareDisableL1ValidatorTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareDisableL1ValidatorTxnParameters
): Promise<PrepareDisableL1ValidatorTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams, disableOwners } = await fetchCommonTxParams(client, {
    txParams: params,
    context,
    l1ValidationId: params.validationId,
  });

  if (!disableOwners) {
    throw new Error(
      "Disable owners not found for a DisableL1ValidatorTx. Either the validator is removed, or incorrect."
    );
  }

  const unsignedTx = pvm.newDisableL1ValidatorTx(
    {
      ...commonTxParams,
      validationId: params.validationId,
      disableAuth: params.disableAuth,
    },
    context
  );

  return {
    tx: unsignedTx,
    disableOwners,
    disableAuth: (unsignedTx.getTx() as pvmSerial.DisableL1ValidatorTx)
      .getDisableAuth()
      .values(),
    chainAlias: P_CHAIN_ALIAS,
  };
}
