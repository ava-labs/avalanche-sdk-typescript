import { RequestErrorType } from "viem/utils";

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
}

export type GetTxFeeErrorType = RequestErrorType;

export type GetTxFeeMethod = {
    Method: "info.getTxFee";
    Parameters: {};
    ReturnType: GetTxFeeReturnType;
}