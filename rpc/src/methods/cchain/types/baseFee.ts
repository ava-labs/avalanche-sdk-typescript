import { RequestErrorType } from "viem/utils";

export type BaseFeeReturnType = string;

export type BaseFeeErrorType = RequestErrorType;

export type BaseFeeMethod = {
    Method: "eth_baseFee";
    Parameters: [];
    ReturnType: BaseFeeReturnType;
}
