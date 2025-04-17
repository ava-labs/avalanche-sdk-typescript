import { RequestErrorType } from "viem/utils";

export type GetFeeStateReturnType = {
    capacity: bigint;
    excess: bigint;
    
    /** Price to use for dynamic fee calculation */
    price: bigint;
    
    /** ISO8601 DateTime */
    timestamp: string;
};

export type GetFeeStateErrorType = RequestErrorType;

export type GetFeeStateMethod = {
    Method: "platform.getFeeState";
    Parameters: {};
    ReturnType: GetFeeStateReturnType;
};
