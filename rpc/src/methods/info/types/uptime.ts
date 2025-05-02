import { RequestErrorType } from "viem/utils";

/**
 * Return type for the info.uptime method.
 * @property rewardingStakePercentage - The percent of stake which thinks this node is above the uptime requirement
 * @property weightedAveragePercentage - The stake-weighted average of all observed uptimes for this node
 */
export type UptimeReturnType = {
  rewardingStakePercentage: number;
  weightedAveragePercentage: number;
};

export type UptimeErrorType = RequestErrorType;

export type UptimeMethod = {
  Method: "info.uptime";
  Parameters: {};
  ReturnType: UptimeReturnType;
};
