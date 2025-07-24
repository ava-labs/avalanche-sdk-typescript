import { pvm, pvmSerial } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonPVMTxParams } from "../utils.js";
import {
  PrepareRemoveSubnetValidatorTxnParameters,
  PrepareRemoveSubnetValidatorTxnReturnType,
} from "./types/prepareRemoveSubnetValidatorTxn.js";

/**
 * Prepares a remove subnet validator transaction for the P-chain.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareRemoveSubnetValidatorTxnParameters}
 * @returns The unsigned transaction. {@link PrepareRemoveSubnetValidatorTxnReturnType}
 *
 * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-remove-avalanche-l1-validator-tx
 *
 * @example
 * ```ts
 * import { prepareRemoveSubnetValidatorTxn } from "@avalanche-sdk/client/methods/wallet/pChain/prepareRemoveSubnetValidatorTxn";
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
 * const pChainRemoveSubnetValidatorTxnRequest = await prepareRemoveSubnetValidatorTxn(walletClient, {
 *   subnetId: "11111111111111111111111111111111LpoYY",
 *   nodeId: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
 *   subnetAuth: [1],
 * });
 *
 * console.log(pChainRemoveSubnetValidatorTxnRequest);
 * ```
 */
export async function prepareRemoveSubnetValidatorTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareRemoveSubnetValidatorTxnParameters
): Promise<PrepareRemoveSubnetValidatorTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams, subnetOwners } = await fetchCommonPVMTxParams(
    client,
    {
      txParams: params,
      context,
      chainAlias: P_CHAIN_ALIAS,
      subnetId: params.subnetId,
    }
  );

  if (!subnetOwners) {
    throw new Error("Subnet owners not found for a Subnet tx");
  }

  const unsignedTx = pvm.newRemoveSubnetValidatorTx(
    {
      ...commonTxParams,
      subnetId: params.subnetId,
      nodeId: params.nodeId,
      subnetAuth: params.subnetAuth,
    },
    context
  );

  return {
    tx: unsignedTx,
    removeSubnetValidatorTx:
      unsignedTx.getTx() as pvmSerial.RemoveSubnetValidatorTx,
    subnetOwners,
    subnetAuth: (unsignedTx.getTx() as pvmSerial.RemoveSubnetValidatorTx)
      .getSubnetAuth()
      .values(),
    chainAlias: P_CHAIN_ALIAS,
  };
}
