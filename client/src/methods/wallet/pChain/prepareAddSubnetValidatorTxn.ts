import { pvm, pvmSerial } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonTxParams } from "../utils.js";
import {
  PrepareAddSubnetValidatorTxnParameters,
  PrepareAddSubnetValidatorTxnReturnType,
} from "./types/prepareAddSubnetValidatorTxn.js";

export async function prepareAddSubnetValidatorTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareAddSubnetValidatorTxnParameters
): Promise<PrepareAddSubnetValidatorTxnReturnType> {
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
  const unsignedTx = pvm.newAddSubnetValidatorTx(
    {
      ...commonTxParams,
      subnetId: params.subnetId,
      nodeId: params.nodeId,
      weight: params.weight,
      start: 0n, // start time is not relevant after Durango upgrade
      end: params.end,
      subnetAuth: params.subnetAuth,
    },
    context
  );

  return {
    tx: unsignedTx,
    subnetOwners,
    subnetAuth: (unsignedTx.getTx() as pvmSerial.AddSubnetValidatorTx)
      .getSubnetAuth()
      .values(),
    chainAlias: P_CHAIN_ALIAS,
  };
}
