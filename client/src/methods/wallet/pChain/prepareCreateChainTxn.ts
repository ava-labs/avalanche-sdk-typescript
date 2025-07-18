import { pvm, pvmSerial } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonTxParams } from "../utils.js";
import {
  PrepareCreateChainTxnParameters,
  PrepareCreateChainTxnReturnType,
} from "./types/prepareCreateChainTxn.js";

export async function prepareCreateChainTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareCreateChainTxnParameters
): Promise<PrepareCreateChainTxnReturnType> {
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
  const unsignedTx = pvm.newCreateChainTx(
    {
      ...commonTxParams,
      subnetId: params.subnetId,
      vmId: params.vmId,
      chainName: params.chainName,
      genesisData: params.genesisData,
      subnetAuth: params.subnetAuth,
      fxIds: params.fxIds ?? [],
    },
    context
  );

  return {
    tx: unsignedTx,
    subnetOwners,
    subnetAuth: (unsignedTx.getTx() as pvmSerial.CreateChainTx)
      .getSubnetAuth()
      .values(),
    chainAlias: P_CHAIN_ALIAS,
  };
}
