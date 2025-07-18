import { pvm, utils } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonTxParams } from "../utils.js";
import {
  PrepareCreateSubnetTxnParameters,
  PrepareCreateSubnetTxnReturnType,
} from "./types/prepareCreateSubnetTxn.js";

export async function prepareCreateSubnetTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareCreateSubnetTxnParameters
): Promise<PrepareCreateSubnetTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams } = await fetchCommonTxParams(client, {
    txParams: params,
    context,
  });

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
