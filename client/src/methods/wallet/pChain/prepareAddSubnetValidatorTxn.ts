import { pvm, pvmSerial } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonPVMTxParams } from "../utils.js";
import {
  PrepareAddSubnetValidatorTxnParameters,
  PrepareAddSubnetValidatorTxnReturnType,
} from "./types/prepareAddSubnetValidatorTxn.js";

/**
 * Prepares an add subnet validator transaction for the P-chain.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareAddSubnetValidatorTxnParameters}
 * @returns The unsigned transaction. {@link PrepareAddSubnetValidatorTxnReturnType}
 *
 * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-add-validator-tx
 *
 * @example
 * ```ts
 * import { prepareAddSubnetValidatorTxn } from "@avalanche-sdk/client/methods/wallet/pChain/prepareAddSubnetValidatorTxn";
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
 * const pChainAddSubnetValidatorTxnRequest = await prepareAddSubnetValidatorTxn(walletClient, {
 *   subnetId: "11111111111111111111111111111111LpoYY",
 *   nodeId: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
 *   weight: 1n,
 *   end: 1716441600n,
 *   subnetAuth: [1],
 * });
 *
 * console.log(pChainAddSubnetValidatorTxnRequest);
 * ```
 */
export async function prepareAddSubnetValidatorTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareAddSubnetValidatorTxnParameters
): Promise<PrepareAddSubnetValidatorTxnReturnType> {
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
  const unsignedTx = pvm.newAddSubnetValidatorTx(
    {
      ...commonTxParams,
      subnetId: params.subnetId,
      nodeId: params.nodeId,
      weight: params.weight,
      start: 0n, // start time is not relevant after Durango upgrade
      end: params.end,
      subnetAuth: params.subnetAuth,
    },
    context
  );

  return {
    tx: unsignedTx,
    addSubnetValidatorTx: unsignedTx.getTx() as pvmSerial.AddSubnetValidatorTx,
    subnetOwners,
    subnetAuth: (unsignedTx.getTx() as pvmSerial.AddSubnetValidatorTx)
      .getSubnetAuth()
      .values(),
    chainAlias: P_CHAIN_ALIAS,
  };
}
