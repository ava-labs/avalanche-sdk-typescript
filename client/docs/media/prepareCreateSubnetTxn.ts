import { pvm, pvmSerial, utils } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { fetchCommonPVMTxParams } from "../utils.js";
import {
  PrepareCreateSubnetTxnParameters,
  PrepareCreateSubnetTxnReturnType,
} from "./types/prepareCreateSubnetTxn.js";

/**
 * Prepares a create subnet transaction for the P-chain.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareCreateSubnetTxnParameters}
 * @returns The unsigned transaction. {@link PrepareCreateSubnetTxnReturnType}
 *
 * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-create-subnet-tx
 *
 * @example
 * ```ts
 * import { prepareCreateSubnetTxn } from "@avalanche-sdk/client/methods/wallet/pChain/prepareCreateSubnetTxn";
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
 * const pChainCreateSubnetTxnRequest = await prepareCreateSubnetTxn(walletClient, {
 *   subnetOwners: {
 *     addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
 *     threshold: 1,
 *   },
 * });
 *
 * console.log(pChainCreateSubnetTxnRequest);
 * ```
 */
export async function prepareCreateSubnetTxn(
  client: AvalancheWalletCoreClient,
  params: PrepareCreateSubnetTxnParameters
): Promise<PrepareCreateSubnetTxnReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const { commonTxParams } = await fetchCommonPVMTxParams(client, {
    txParams: params,
    context,
  });

  const formattedSubnetOwnerAddresses = params.subnetOwners.addresses.map(
    utils.bech32ToBytes
  );

  const unsignedTx = pvm.newCreateSubnetTx(
    {
      ...commonTxParams,
      subnetOwners: formattedSubnetOwnerAddresses,
      locktime: params.subnetOwners.locktime ?? 0n,
      threshold: params.subnetOwners.threshold ?? 1,
    },
    context
  );

  return {
    tx: unsignedTx,
    createSubnetTx: unsignedTx.getTx() as pvmSerial.CreateSubnetTx,
    chainAlias: P_CHAIN_ALIAS,
  };
}
