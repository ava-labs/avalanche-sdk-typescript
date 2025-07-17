import { Context, pvm, pvmSerial } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { fetchCommonTxParams, getBaseUrl } from "../utils.js";
import {
  PrepareRemoveSubnetValidatorTxnParameters,
  PrepareRemoveSubnetValidatorTxnReturnType,
} from "./types/prepareRemoveSubnetValidatorTxn.js";

export async function prepareRemoveSubnetValidatorTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareRemoveSubnetValidatorTxnParameters
): Promise<PrepareRemoveSubnetValidatorTxnReturnType> {
  const { commonTxParams, subnetOwners } = await fetchCommonTxParams(
    client,
    params,
    undefined,
    P_CHAIN_ALIAS,
    params.subnetId
  );

  if (!subnetOwners) {
    throw new Error("Subnet owners not found for a Subnet tx");
  }

  const baseUrl = getBaseUrl(client);
  const context = params.context || (await Context.getContextFromURI(baseUrl));

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
