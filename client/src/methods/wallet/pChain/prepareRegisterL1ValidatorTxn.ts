import { pvm, pvmSerial, utils } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonPVMTxParams } from "../utils.js";
import {
  PrepareRegisterL1ValidatorTxnParameters,
  PrepareRegisterL1ValidatorTxnReturnType,
} from "./types/prepareRegisterL1ValidatorTxn.js";

/**
 * Prepares a register L1 validator transaction for the P-chain.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareRegisterL1ValidatorTxnParameters}
 * @returns The unsigned transaction. {@link PrepareRegisterL1ValidatorTxnReturnType}
 *
 * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-register-l1-validator-tx
 *
 * @example
 * ```ts
 * import { prepareRegisterL1ValidatorTxn } from "@avalanche-sdk/client/methods/wallet/pChain/prepareRegisterL1ValidatorTxn";
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
 * const pChainRegisterL1ValidatorTxnRequest = await prepareRegisterL1ValidatorTxn(walletClient, {
 *   initialBalanceInAvax: avaxToNanoAvax(1),
 *   blsSignature: "0x1234567890123456789012345678901234567890",
 *   message: "0x1234567890123456789012345678901234567890",
 * });
 *
 * console.log(pChainRegisterL1ValidatorTxnRequest);
 * ```
 */
export async function prepareRegisterL1ValidatorTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareRegisterL1ValidatorTxnParameters
): Promise<PrepareRegisterL1ValidatorTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams } = await fetchCommonPVMTxParams(client, {
    txParams: params,
    context,
  });

  const unsignedTx = pvm.newRegisterL1ValidatorTx(
    {
      ...commonTxParams,
      balance: params.initialBalanceInAvax,
      blsSignature: utils.hexToBuffer(params.blsSignature),
      message: utils.hexToBuffer(params.message),
    },
    context
  );

  return {
    tx: unsignedTx,
    registerL1ValidatorTx:
      unsignedTx.getTx() as pvmSerial.RegisterL1ValidatorTx,
    chainAlias: P_CHAIN_ALIAS,
  };
}
