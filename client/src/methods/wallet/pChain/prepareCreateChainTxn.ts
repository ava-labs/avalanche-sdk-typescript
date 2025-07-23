import { pvm, pvmSerial } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonPVMTxParams } from "../utils.js";
import {
  PrepareCreateChainTxnParameters,
  PrepareCreateChainTxnReturnType,
} from "./types/prepareCreateChainTxn.js";

/**
 * Prepares a create chain transaction for the P-chain.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareCreateChainTxnParameters}
 * @returns The unsigned transaction. {@link PrepareCreateChainTxnReturnType}
 *
 * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-create-chain-tx
 *
 * @example
 * ```ts
 * import { prepareCreateChainTxn } from "@avalanche-sdk/client/methods/wallet/pChain/prepareCreateChainTxn";
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
 * const pChainCreateChainTxnRequest = await prepareCreateChainTxn(walletClient, {
 *   subnetId: "..",
 *   vmId: "..",
 *   chainName: "My Chain",
 *   genesisData: "0x1234567890123456789012345678901234567890",
 *   subnetAuth: [1],
 * });
 *
 * console.log(pChainCreateChainTxnRequest);
 * ```
 */
export async function prepareCreateChainTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareCreateChainTxnParameters
): Promise<PrepareCreateChainTxnReturnType> {
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
  const unsignedTx = pvm.newCreateChainTx(
    {
      ...commonTxParams,
      subnetId: params.subnetId,
      vmId: params.vmId,
      chainName: params.chainName,
      genesisData: params.genesisData,
      subnetAuth: params.subnetAuth,
      fxIds: params.fxIds ?? [],
    },
    context
  );

  return {
    tx: unsignedTx,
    createChainTx: unsignedTx.getTx() as pvmSerial.CreateChainTx,
    subnetOwners,
    subnetAuth: (unsignedTx.getTx() as pvmSerial.CreateChainTx)
      .getSubnetAuth()
      .values(),
    chainAlias: P_CHAIN_ALIAS,
  };
}
