import { pvm, pvmSerial, utils } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { bech32AddressToBytes, fetchCommonPVMTxParams } from "../utils.js";
import {
  PrepareAddAutoRenewedValidatorTxnParameters,
  PrepareAddAutoRenewedValidatorTxnReturnType,
} from "./types/prepareAddAutoRenewedValidatorTxn.js";

/**
 * Prepares an add auto-renewed validator transaction for the P-chain.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareAddAutoRenewedValidatorTxnParameters}
 * @returns The unsigned transaction. {@link PrepareAddAutoRenewedValidatorTxnReturnType}
 *
 * @example
 * ```ts
 * import { prepareAddAutoRenewedValidatorTxn } from "@avalanche-sdk/client/methods/wallet/pChain/prepareAddAutoRenewedValidatorTxn";
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
 * const pChainAddAutoRenewedValidatorTxnRequest = await prepareAddAutoRenewedValidatorTxn(walletClient, {
 *   nodeId: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
 *   stakeInNanoAvax: avaxToNanoAvax(2000),
 *   period: 1209600n,
 *   rewardAddresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
 *   delegatorRewardAddresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
 *   ownerAddresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
 *   publicKey: "0x1234567890123456789012345678901234567890",
 *   signature: "0x1234567890123456789012345678901234567890",
 *   delegatorRewardPercentage: 2.5,
 *   autoCompoundRewardPercentage: 100,
 * });
 *
 * console.log(pChainAddAutoRenewedValidatorTxnRequest);
 * ```
 */
export async function prepareAddAutoRenewedValidatorTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareAddAutoRenewedValidatorTxnParameters
): Promise<PrepareAddAutoRenewedValidatorTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams } = await fetchCommonPVMTxParams(client, {
    txParams: params,
    context,
  });

  const unsignedTx = pvm.newAddAutoRenewedValidatorTx(
    {
      ...commonTxParams,
      weight: params.stakeInNanoAvax,
      nodeId: params.nodeId,
      rewardAddresses: params.rewardAddresses.map(bech32AddressToBytes),
      delegatorRewardsOwner:
        params.delegatorRewardAddresses.map(bech32AddressToBytes),
      ownerAddresses: params.ownerAddresses.map(bech32AddressToBytes),
      shares: params.delegatorRewardPercentage * 10000,
      autoCompoundRewardShares: params.autoCompoundRewardPercentage * 10000,
      period: params.period,
      threshold: params.threshold ?? 1,
      locktime: BigInt(params.locktime ?? 0n),
      publicKey: utils.hexToBuffer(params.publicKey),
      signature: utils.hexToBuffer(params.signature),
    },
    context
  );

  return {
    tx: unsignedTx,
    addAutoRenewedValidatorTx:
      unsignedTx.getTx() as pvmSerial.AddAutoRenewedValidatorTx,
    chainAlias: P_CHAIN_ALIAS,
  };
}
