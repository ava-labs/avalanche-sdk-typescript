import { RequestErrorType } from "viem/utils";

export type GetTxFeeReturnType = {
    txFee: number;
    createAssetTxFee: number;
};

export type GetTxFeeErrorType = RequestErrorType;

export type GetTxFeeMethod = {
    Method: "avm.getTxFee";
    Parameters: {};
    ReturnType: GetTxFeeReturnType;
};