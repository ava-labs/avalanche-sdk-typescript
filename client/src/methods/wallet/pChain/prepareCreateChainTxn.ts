import { Context, pvm, pvmSerial } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "src/clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "src/methods/consts.js";
import { fetchCommonTxParams, getBaseUrl } from "../utils.js";
import {
  PrepareCreateChainTxnParameters,
  PrepareCreateChainTxnReturnType,
} from "./types/prepareCreateChainTxn.js";

export async function prepareCreateChainTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareCreateChainTxnParameters
): Promise<PrepareCreateChainTxnReturnType> {
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
