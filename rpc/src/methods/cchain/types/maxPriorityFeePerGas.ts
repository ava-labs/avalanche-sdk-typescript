import { RequestErrorType } from "viem/utils";

export type MaxPriorityFeePerGasReturnType = string;

export type MaxPriorityFeePerGasErrorType = RequestErrorType;

export type MaxPriorityFeePerGasMethod = {
    Method: "eth_maxPriorityFeePerGas";
    Parameters: [];
    ReturnType: MaxPriorityFeePerGasReturnType;
}