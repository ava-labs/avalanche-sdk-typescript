import { pvm, pvmSerial, utils } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonPVMTxParams } from "../utils.js";
import {
  PrepareSetL1ValidatorWeightTxnParameters,
  PrepareSetL1ValidatorWeightTxnReturnType,
} from "./types/prepareSetL1ValidatorWeightTxn.js";

/**
 * Prepares a set L1 validator weight transaction for the P-chain.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareSetL1ValidatorWeightTxnParameters}
 * @returns The unsigned transaction. {@link PrepareSetL1ValidatorWeightTxnReturnType}
 *
 * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-set-l1-validator-weight-tx
 *
 * @example
 * ```ts
 * import { prepareSetL1ValidatorWeightTxn } from "@avalanche-sdk/client/methods/wallet/pChain/prepareSetL1ValidatorWeightTxn";
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
 * const pChainSetL1ValidatorWeightTxnRequest = await prepareSetL1ValidatorWeightTxn(walletClient, {
 *   message: "0x1234567890123456789012345678901234567890",
 * });
 *
 * console.log(pChainSetL1ValidatorWeightTxnRequest);
 * ```
 */
export async function prepareSetL1ValidatorWeightTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareSetL1ValidatorWeightTxnParameters
): Promise<PrepareSetL1ValidatorWeightTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams } = await fetchCommonPVMTxParams(client, {
    txParams: params,
    context,
  });

  const unsignedTx = pvm.newSetL1ValidatorWeightTx(
    {
      ...commonTxParams,
      message: utils.hexToBuffer(params.message),
    },
    context
  );

  return {
    tx: unsignedTx,
    setL1ValidatorWeightTx:
      unsignedTx.getTx() as pvmSerial.SetL1ValidatorWeightTx,
    chainAlias: P_CHAIN_ALIAS,
  };
}
