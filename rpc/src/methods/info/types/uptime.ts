import { RequestErrorType } from "viem/utils";

export type UptimeReturnType = {
    rewardingStakePercentage: number;
    weightedAveragePercentage: number;
}

export type UptimeErrorType = RequestErrorType;

export type UptimeMethod = {
    Method: "info.uptime";
    Parameters: {};
    ReturnType: UptimeReturnType;
}