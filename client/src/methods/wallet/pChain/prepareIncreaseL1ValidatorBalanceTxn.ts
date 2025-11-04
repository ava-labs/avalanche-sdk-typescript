import { pvm, pvmSerial } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonPVMTxParams } from "../utils.js";
import {
  PrepareIncreaseL1ValidatorBalanceTxnParameters,
  PrepareIncreaseL1ValidatorBalanceTxnReturnType,
} from "./types/prepareIncreaseL1ValidatorBalanceTxn.js";

/**
 * Prepares an increase L1 validator balance transaction for the P-chain.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareIncreaseL1ValidatorBalanceTxnParameters}
 * @returns The unsigned transaction. {@link PrepareIncreaseL1ValidatorBalanceTxnReturnType}
 *
 * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-increase-l1-validator-balance-tx
 *
 * @example
 * ```ts
 * import { prepareIncreaseL1ValidatorBalanceTxn } from "@avalanche-sdk/client/methods/wallet/pChain/prepareIncreaseL1ValidatorBalanceTxn";
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
 * const pChainIncreaseL1ValidatorBalanceTxnRequest = await prepareIncreaseL1ValidatorBalanceTxn(walletClient, {
 *   balanceInAvax: avaxToNanoAvax(1),
 *   validationId: "11111111111111111111111111111111LpoYY",
 * });
 *
 * console.log(pChainIncreaseL1ValidatorBalanceTxnRequest);
 * ```
 */
export async function prepareIncreaseL1ValidatorBalanceTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareIncreaseL1ValidatorBalanceTxnParameters
): Promise<PrepareIncreaseL1ValidatorBalanceTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams } = await fetchCommonPVMTxParams(client, {
    txParams: params,
    context,
  });

  const unsignedTx = pvm.newIncreaseL1ValidatorBalanceTx(
    {
      ...commonTxParams,
      balance: params.balanceInAvax,
      validationId: params.validationId,
    },
    context
  );

  return {
    tx: unsignedTx,
    increaseL1ValidatorBalanceTx:
      unsignedTx.getTx() as pvmSerial.IncreaseL1ValidatorBalanceTx,
    chainAlias: P_CHAIN_ALIAS,
  };
}
