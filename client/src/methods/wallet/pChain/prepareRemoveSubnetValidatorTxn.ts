import { pvm, pvmSerial } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonTxParams } from "../utils.js";
import {
  PrepareRemoveSubnetValidatorTxnParameters,
  PrepareRemoveSubnetValidatorTxnReturnType,
} from "./types/prepareRemoveSubnetValidatorTxn.js";

export async function prepareRemoveSubnetValidatorTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareRemoveSubnetValidatorTxnParameters
): Promise<PrepareRemoveSubnetValidatorTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams, subnetOwners } = await fetchCommonTxParams(client, {
    txParams: params,
    context,
    chainAlias: P_CHAIN_ALIAS,
    subnetId: params.subnetId,
  });

  if (!subnetOwners) {
    throw new Error("Subnet owners not found for a Subnet tx");
  }

  const unsignedTx = pvm.newRemoveSubnetValidatorTx(
    {
      ...commonTxParams,
      subnetId: params.subnetId,
      nodeId: params.nodeId,
      subnetAuth: params.subnetAuth,
    },
    context
  );

  return {
    tx: unsignedTx,
    subnetOwners,
    subnetAuth: (unsignedTx.getTx() as pvmSerial.RemoveSubnetValidatorTx)
      .getSubnetAuth()
      .values(),
    chainAlias: P_CHAIN_ALIAS,
  };
}
