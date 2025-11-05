import {
  L1Validator as FormattedL1Validator,
  PChainOwner as FormattedPChainOwner,
  pvm,
  pvmSerial,
  utils,
} from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { bech32AddressToBytes, fetchCommonPVMTxParams } from "../utils.js";
import {
  PrepareConvertSubnetToL1TxnParameters,
  PrepareConvertSubnetToL1TxnReturnType,
} from "./types/prepareConvertSubnetToL1Txn.js";

/**
 * Prepares a convert subnet to L1 transaction for the P-chain.
 *
 * @param client - The client to use for the transaction. {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction. {@link PrepareConvertSubnetToL1TxnParameters}
 * @returns The unsigned transaction. {@link PrepareConvertSubnetToL1TxnReturnType}
 *
 * @see https://build.avax.network/docs/api-reference/p-chain/txn-format#unsigned-convert-subnet-to-l1-tx
 *
 * @example
 * ```ts
 * import { prepareConvertSubnetToL1Txn } from "@avalanche-sdk/client/methods/wallet/pChain/prepareConvertSubnetToL1Txn";
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
 * const pChainConvertSubnetToL1TxnRequest = await prepareConvertSubnetToL1Txn(walletClient, {
 *   subnetId: "11111111111111111111111111111111LpoYY",
 *   blockchainId: 1,
 *   managerContractAddress: "0x1234567890123456789012345678901234567890",
 *   subnetAuth: [1],
 *   validators: [
 *     {
 *       nodeId: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
 *       weight: 1n,
 *       initialBalanceInAvax: avaxToNanoAvax(1),
 *       nodePoP: {
 *         publicKey: "0x1234567890123456789012345678901234567890",
 *         proofOfPossession: "0x1234567890123456789012345678901234567890",
 *       },
 *       remainingBalanceOwner: {
 *         addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
 *         threshold: 1,
 *       },
 *       deactivationOwner: {
 *         addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
 *         threshold: 1,
 *       },
 *     },
 *   ],
 * });
 *
 * console.log(pChainConvertSubnetToL1TxnRequest);
 * ```
 */
export async function prepareConvertSubnetToL1Txn(
  client: AvalancheWalletCoreClient,
  params: PrepareConvertSubnetToL1TxnParameters
): Promise<PrepareConvertSubnetToL1TxnReturnType> {
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

  const validators: FormattedL1Validator[] = params.validators.map(
    (validator) =>
      FormattedL1Validator.fromNative(
        validator.nodeId,
        validator.weight,
        validator.initialBalanceInAvax,
        new pvmSerial.ProofOfPossession(
          utils.hexToBuffer(validator.nodePoP.publicKey),
          utils.hexToBuffer(validator.nodePoP.proofOfPossession)
        ),
        FormattedPChainOwner.fromNative(
          validator.remainingBalanceOwner.addresses.map((address) =>
            bech32AddressToBytes(address)
          ),
          validator.remainingBalanceOwner.threshold
        ),
        FormattedPChainOwner.fromNative(
          validator.deactivationOwner.addresses.map((address) =>
            bech32AddressToBytes(address)
          ),
          validator.deactivationOwner.threshold
        )
      )
  );

  const unsignedTx = pvm.newConvertSubnetToL1Tx(
    {
      ...commonTxParams,
      subnetId: params.subnetId,
      chainId: params.blockchainId,
      address: utils.hexToBuffer(params.managerContractAddress),
      subnetAuth: params.subnetAuth,
      validators,
    },
    context
  );

  return {
    tx: unsignedTx,
    convertSubnetToL1Tx: unsignedTx.getTx() as pvmSerial.ConvertSubnetToL1Tx,
    subnetOwners,
    subnetAuth: (unsignedTx.getTx() as pvmSerial.ConvertSubnetToL1Tx)
      .getSubnetAuth()
      .values(),
    chainAlias: P_CHAIN_ALIAS,
  };
}
