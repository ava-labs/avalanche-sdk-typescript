import { RequestErrorType } from "viem/utils";

export type GetCurrentSupplyParameters = {
    subnetId?: string;
}

export type GetCurrentSupplyReturnType = {
    /**
     * An upper bound on the number of tokens that exist.
     */
    supply: bigint;
}

export type GetCurrentSupplyErrorType = RequestErrorType;

export type GetCurrentSupplyMethod = {
    Method: "platform.getCurrentSupply";
    Parameters: GetCurrentSupplyParameters;
    ReturnType: GetCurrentSupplyReturnType;
}