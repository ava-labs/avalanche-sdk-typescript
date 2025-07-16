import { Context, pvm, utils } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "src/clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "src/methods/consts.js";
import {
  bech32AddressToBytes,
  fetchCommonTxParams,
  getBaseUrl,
} from "../utils.js";
import {
  PrepareAddPermissionlessValidatorTxnParameters,
  PrepareAddPermissionlessValidatorTxnReturnType,
} from "./types/prepareAddPermissionlessValidatorTxn.js";

export async function prepareAddPermissionlessValidatorTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareAddPermissionlessValidatorTxnParameters
): Promise<PrepareAddPermissionlessValidatorTxnReturnType> {
  const { commonTxParams } = await fetchCommonTxParams(client, params);
  const baseUrl = getBaseUrl(client);
  const context = params.context || (await Context.getContextFromURI(baseUrl));

  const unsignedTx = pvm.newAddPermissionlessValidatorTx(
    {
      ...commonTxParams,
      weight: BigInt(params.stakeInAvax * 1e9),
      nodeId: params.nodeId,
      start: 0n, // start time is not relevant after Durango upgrade
      end: BigInt(params.end),
      rewardAddresses: params.rewardAddresses.map(bech32AddressToBytes),
      delegatorRewardsOwner:
        params.delegatorRewardAddresses.map(bech32AddressToBytes),
      shares: params.delegatorRewardPercentage * 10000,
      threshold: params.threshold ?? 1,
      locktime: BigInt(params.locktime ?? 0n),
      // accept only Primary Network staking for permissionless validators
      subnetId: "11111111111111111111111111111111LpoYY",
      // publicKey and signature params don't accept undefined passed explicitly
      ...(params.publicKey
        ? { publicKey: utils.hexToBuffer(params.publicKey) }
        : {}),
      ...(params.signature
        ? { signature: utils.hexToBuffer(params.signature) }
        : {}),
    },
    context
  );

  return {
    tx: unsignedTx,
    chainAlias: P_CHAIN_ALIAS,
  };
}
