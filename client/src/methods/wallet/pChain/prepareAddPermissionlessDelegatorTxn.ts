import { Context, pvm } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import {
  bech32AddressToBytes,
  fetchCommonTxParams,
  getBaseUrl,
} from "../utils.js";
import {
  PrepareAddPermissionlessDelegatorTxnParameters,
  PrepareAddPermissionlessDelegatorTxnReturnType,
} from "./types/prepareAddPermissionlessDelegatorTxn.js";

export async function prepareAddPermissionlessDelegatorTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareAddPermissionlessDelegatorTxnParameters
): Promise<PrepareAddPermissionlessDelegatorTxnReturnType> {
  const { commonTxParams } = await fetchCommonTxParams(client, params);
  const baseUrl = getBaseUrl(client);
  const context = params.context || (await Context.getContextFromURI(baseUrl));

  const unsignedTx = pvm.newAddPermissionlessDelegatorTx(
    {
      ...commonTxParams,
      weight: BigInt(params.stakeInAvax * 1e9),
      nodeId: params.nodeId,
      start: 0n, // start time is not relevant after Durango upgrade
      end: BigInt(params.end),
      rewardAddresses: params.rewardAddresses.map(bech32AddressToBytes),
      threshold: params.threshold ?? 1,
      locktime: BigInt(params.locktime ?? 0n),
      subnetId: "11111111111111111111111111111111LpoYY", // accept only Primary Network staking for permissionless validators
    },
    context
  );

  return {
    tx: unsignedTx,
    chainAlias: P_CHAIN_ALIAS,
  };
}
