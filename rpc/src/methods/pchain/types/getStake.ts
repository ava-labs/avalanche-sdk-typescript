import { RequestErrorType } from "viem/utils";

export type GetStakeParameters = {
    addresses: string[];
    validatorsOnly?: boolean;
};

export type GetStakeReturnType = {
    staked: bigint;
    stakeds: Record<string, number>;
    stakedOutputs: string[];
    encoding: "hex";
};

export type GetStakeErrorType = RequestErrorType;

export type GetStakeMethod = {
    Method: "platform.getStake";
    Parameters: GetStakeParameters;
    ReturnType: GetStakeReturnType;
};