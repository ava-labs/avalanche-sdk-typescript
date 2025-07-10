import { RequestErrorType } from "viem/utils";

/**
 * Return type for the info.getTxFee method.
 * @property txFee - The base transaction fee
 * @property createAssetTxFee - The fee for creating an asset
 * @property createSubnetTxFee - The fee for creating a subnet
 * @property transformSubnetTxFee - The fee for transforming a subnet
 * @property createBlockchainTxFee - The fee for creating a blockchain
 * @property addPrimaryNetworkValidatorFee - The fee for adding a primary network validator
 * @property addPrimaryNetworkDelegatorFee - The fee for adding a primary network delegator
 * @property addSubnetValidatorFee - The fee for adding a subnet validator
 * @property addSubnetDelegatorFee - The fee for adding a subnet delegator
 */
export type GetTxFeeReturnType = {
  txFee: bigint;
  createAssetTxFee: bigint;
  createSubnetTxFee: bigint;
  transformSubnetTxFee: bigint;
  createBlockchainTxFee: bigint;
  addPrimaryNetworkValidatorFee: bigint;
  addPrimaryNetworkDelegatorFee: bigint;
  addSubnetValidatorFee: bigint;
  addSubnetDelegatorFee: bigint;
};

export type GetTxFeeErrorType = RequestErrorType;

export type GetTxFeeMethod = {
  Method: "info.getTxFee";
  Parameters: {};
  ReturnType: GetTxFeeReturnType;
};
