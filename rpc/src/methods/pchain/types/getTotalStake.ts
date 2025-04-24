import { RequestErrorType } from "viem/utils";

export type GetTotalStakeParameters = {
    subnetID: string;
}

export type GetTotalStakeReturnType = {
    weight: number;
    stake?: number;
}

export type GetTotalStakeErrorType = RequestErrorType;

export type GetTotalStakeMethod = {
    Method: "platform.getTotalStake";
    Parameters: GetTotalStakeParameters;
    ReturnType: GetTotalStakeReturnType;
}