import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `platform.getMinStake` method.
 * Get the minimum stake required for validators and delegators.
 * @property subnetID - The ID of the Subnet to get minimum stake for. If omitted, gets minimum stake for the Primary Network
 */
export type GetMinStakeParameters = {
  subnetID?: string;
};

/**
 * Return type for the `platform.getMinStake` method.
 * @property minValidatorStake - The minimum amount of stake required for a validator
 * @property minDelegatorStake - The minimum amount of stake required for a delegator
 */
export type GetMinStakeReturnType = {
  minValidatorStake: bigint;
  minDelegatorStake: bigint;
};

export type GetMinStakeErrorType = RequestErrorType;

export type GetMinStakeMethod = {
  Method: "platform.getMinStake";
  Parameters: GetMinStakeParameters;
  ReturnType: GetMinStakeReturnType;
};
