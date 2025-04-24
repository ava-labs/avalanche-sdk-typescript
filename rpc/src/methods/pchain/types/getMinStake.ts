import { RequestErrorType } from "viem/utils";

export type GetMinStakeParameters = {
    subnetID?: string;
}

export type GetMinStakeReturnType = {
    minValidatorStake: bigint;
    minDelegatorStake: bigint;
}

export type GetMinStakeErrorType = RequestErrorType;

export type GetMinStakeMethod = {
    Method: "platform.getMinStake";
    Parameters: GetMinStakeParameters;
    ReturnType: GetMinStakeReturnType;
}