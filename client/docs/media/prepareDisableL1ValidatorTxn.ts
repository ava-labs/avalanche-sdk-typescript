import { pvm, pvmSerial } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonPVMTxParams } from "../utils.js";
import {
  PrepareDisableL1ValidatorTxnParameters,
  PrepareDisableL1ValidatorTxnReturnType,
} from "./types/prepareDisableL1ValidatorTxn.js";

/**
 * Prepares a disable L1 validator transaction for the P-chain.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareDisableL1ValidatorTxnParameters}
 * @returns The unsigned transaction. {@link PrepareDisableL1ValidatorTxnReturnType}
 *
 * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-disable-l1-validator-tx
 *
 * @example
 * ```ts
 * import { prepareDisableL1ValidatorTxn } from "@avalanche-sdk/client/methods/wallet/pChain/prepareDisableL1ValidatorTxn";
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
 * const pChainDisableL1ValidatorTxnRequest = await prepareDisableL1ValidatorTxn(walletClient, {
 *   validationId: "11111111111111111111111111111111LpoYY",
 *   disableAuth: [0],
 * });
 *
 * console.log(pChainDisableL1ValidatorTxnRequest);
 * ```
 */
export async function prepareDisableL1ValidatorTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareDisableL1ValidatorTxnParameters
): Promise<PrepareDisableL1ValidatorTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams, disableOwners } = await fetchCommonPVMTxParams(
    client,
    {
      txParams: params,
      context,
      l1ValidationId: params.validationId,
    }
  );

  if (!disableOwners) {
    throw new Error(
      "Disable owners not found for a DisableL1ValidatorTx. Either the validator is removed, or incorrect."
    );
  }

  const unsignedTx = pvm.newDisableL1ValidatorTx(
    {
      ...commonTxParams,
      validationId: params.validationId,
      disableAuth: params.disableAuth,
    },
    context
  );

  return {
    tx: unsignedTx,
    disableL1ValidatorTx: unsignedTx.getTx() as pvmSerial.DisableL1ValidatorTx,
    disableOwners,
    disableAuth: (unsignedTx.getTx() as pvmSerial.DisableL1ValidatorTx)
      .getDisableAuth()
      .values(),
    chainAlias: P_CHAIN_ALIAS,
  };
}
