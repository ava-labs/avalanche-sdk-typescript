import {
  Context,
  L1Validator as FormattedL1Validator,
  PChainOwner as FormattedPChainOwner,
  pvm,
  pvmSerial,
  utils,
} from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
import {
  avaxToNanoAvax,
  bech32AddressToBytes,
  fetchCommonTxParams,
  getBaseUrl,
} from "../utils.js";
import {
  PrepareConvertSubnetToL1TxnParameters,
  PrepareConvertSubnetToL1TxnReturnType,
} from "./types/prepareConvertSubnetToL1Txn.js";

export async function prepareConvertSubnetToL1Txn(
  client: AvalancheWalletCoreClient,
  params: PrepareConvertSubnetToL1TxnParameters
): Promise<PrepareConvertSubnetToL1TxnReturnType> {
  const { commonTxParams, subnetOwners } = await fetchCommonTxParams(
    client,
    params,
    undefined,
    P_CHAIN_ALIAS,
    params.subnetId
  );

  if (!subnetOwners) {
    throw new Error("Subnet owners not found for a Subnet tx");
  }

  const baseUrl = getBaseUrl(client);
  const context = params.context || (await Context.getContextFromURI(baseUrl));

  const validators: FormattedL1Validator[] = params.validators.map(
    (validator) =>
      FormattedL1Validator.fromNative(
        validator.nodeId,
        validator.weight,
        avaxToNanoAvax(validator.initialBalanceInAvax),
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
    subnetOwners,
    subnetAuth: (unsignedTx.getTx() as pvmSerial.ConvertSubnetToL1Tx)
      .getSubnetAuth()
      .values(),
    chainAlias: P_CHAIN_ALIAS,
  };
}
