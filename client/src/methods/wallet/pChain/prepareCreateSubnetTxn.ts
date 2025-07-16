import { Context, pvm, utils } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "src/clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "src/methods/consts.js";
import { fetchCommonTxParams, getBaseUrl } from "../utils.js";
import {
  PrepareCreateSubnetTxnParameters,
  PrepareCreateSubnetTxnReturnType,
} from "./types/prepareCreateSubnetTxn.js";

export async function prepareCreateSubnetTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareCreateSubnetTxnParameters
): Promise<PrepareCreateSubnetTxnReturnType> {
  const { commonTxParams } = await fetchCommonTxParams(client, params);
  const baseUrl = getBaseUrl(client);
  const context = params.context || (await Context.getContextFromURI(baseUrl));

  const formattedSubnetOwnerAddresses = params.subnetOwners.addresses.map(
    utils.bech32ToBytes
  );

  const unsignedTx = pvm.newCreateSubnetTx(
    {
      ...commonTxParams,
      subnetOwners: formattedSubnetOwnerAddresses,
      locktime: params.subnetOwners.locktime ?? 0n,
      threshold: params.subnetOwners.threshold ?? 1,
    },
    context
  );

  return {
    tx: unsignedTx,
    chainAlias: P_CHAIN_ALIAS,
  };
}
