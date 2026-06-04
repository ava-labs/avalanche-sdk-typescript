import { pvm, pvmSerial } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonPVMTxParams } from "../utils.js";
import {
  PrepareSetAutoRenewedValidatorConfigTxnParameters,
  PrepareSetAutoRenewedValidatorConfigTxnReturnType,
} from "./types/prepareSetAutoRenewedValidatorConfigTxn.js";

/**
 * Prepares a set auto-renewed validator config transaction for the P-chain.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareSetAutoRenewedValidatorConfigTxnParameters}
 * @returns The unsigned transaction. {@link PrepareSetAutoRenewedValidatorConfigTxnReturnType}
 *
 * @example
 * ```ts
 * import { prepareSetAutoRenewedValidatorConfigTxn } from "@avalanche-sdk/client/methods/wallet/pChain/prepareSetAutoRenewedValidatorConfigTxn";
 * import { createAvalancheWalletClient } from "@avalanche-sdk/client/clients/createAvalancheWalletClient";
 * import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
 * import { avalanche } from "@avalanche-sdk/client/chains";
 *
 * const account = privateKeyToAvalancheAccount("0x1234567890123456789012345678901234567890");
 * const walletClient = createAvalancheWalletClient({
 *   account,
 *   chain: avalanche,
 * });
 *
 * const pChainSetAutoRenewedValidatorConfigTxnRequest =
 *   await prepareSetAutoRenewedValidatorConfigTxn(walletClient, {
 *     validatorTxId: "11111111111111111111111111111111LpoYY",
 *     auth: [0],
 *     period: 1209600n,
 *     autoCompoundRewardPercentage: 30,
 *   });
 *
 * console.log(pChainSetAutoRenewedValidatorConfigTxnRequest);
 * ```
 */
export async function prepareSetAutoRenewedValidatorConfigTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareSetAutoRenewedValidatorConfigTxnParameters
): Promise<PrepareSetAutoRenewedValidatorConfigTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams, autoRenewedValidatorOwners } =
    await fetchCommonPVMTxParams(client, {
      txParams: params,
      context,
      autoRenewedValidatorTxId: params.validatorTxId,
    });

  if (!autoRenewedValidatorOwners) {
    throw new Error(
      "Auto-renewed validator owners not found for a SetAutoRenewedValidatorConfigTx. Either the validator is removed, or incorrect."
    );
  }

  const unsignedTx = pvm.newSetAutoRenewedValidatorConfigTx(
    {
      ...commonTxParams,
      validatorTxId: params.validatorTxId,
      auth: params.auth,
      autoCompoundRewardShares: params.autoCompoundRewardPercentage * 10000,
      period: params.period,
    },
    context
  );
  const setAutoRenewedValidatorConfigTx =
    unsignedTx.getTx() as pvmSerial.SetAutoRenewedValidatorConfigTx;

  return {
    tx: unsignedTx,
    setAutoRenewedValidatorConfigTx,
    autoRenewedValidatorOwners,
    autoRenewedValidatorAuth: setAutoRenewedValidatorConfigTx
      .getAuth()
      .values(),
    chainAlias: P_CHAIN_ALIAS,
  };
}
