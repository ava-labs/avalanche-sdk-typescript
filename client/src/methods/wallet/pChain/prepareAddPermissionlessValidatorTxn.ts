import { pvm, pvmSerial, utils } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { bech32AddressToBytes, fetchCommonPVMTxParams } from "../utils.js";
import {
  PrepareAddPermissionlessValidatorTxnParameters,
  PrepareAddPermissionlessValidatorTxnReturnType,
} from "./types/prepareAddPermissionlessValidatorTxn.js";

/**
 * Prepares an add permissionless validator transaction for the P-chain.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareAddPermissionlessValidatorTxnParameters}
 * @returns The unsigned transaction. {@link PrepareAddPermissionlessValidatorTxnReturnType}
 *
 * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-add-permissionless-validator-tx
 *
 * @example
 * ```ts
 * import { prepareAddPermissionlessValidatorTxn } from "@avalanche-sdk/client/methods/wallet/pChain/prepareAddPermissionlessValidatorTxn";
 * import { createAvalancheWalletClient } from "@avalanche-sdk/client/clients/createAvalancheWalletClient";
 * import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
 * import { avalanche } from "@avalanche-sdk/client/chains";
 * import { avaxToNanoAvax } from "@avalanche-sdk/client/utils";
 *
 * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890");
 * const walletClient = createAvalancheWalletClient({
 *   account,
 *   chain: avalanche,
 * });
 *
 * const pChainAddPermissionlessValidatorTxnRequest = await prepareAddPermissionlessValidatorTxn(walletClient, {
 *   nodeId: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
 *   stakeInAvax: avaxToNanoAvax(1),
 *   end: 1716441600n,
 *   rewardAddresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
 *   threshold: 1,
 *   publicKey: "0x1234567890123456789012345678901234567890",
 *   signature: "0x1234567890123456789012345678901234567890",
 *   locktime: 1716441600n,
 *   delegatorRewardPercentage: 2.5,
 *   delegatorRewardAddresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
 * });
 *
 * console.log(pChainAddPermissionlessValidatorTxnRequest);
 * ```
 */
export async function prepareAddPermissionlessValidatorTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareAddPermissionlessValidatorTxnParameters
): Promise<PrepareAddPermissionlessValidatorTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams } = await fetchCommonPVMTxParams(client, {
    txParams: params,
    context,
  });

  const unsignedTx = pvm.newAddPermissionlessValidatorTx(
    {
      ...commonTxParams,
      weight: params.stakeInAvax,
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
    addPermissionlessValidatorTx:
      unsignedTx.getTx() as pvmSerial.AddPermissionlessValidatorTx,
    chainAlias: P_CHAIN_ALIAS,
  };
}
