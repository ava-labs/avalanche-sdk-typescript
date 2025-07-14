import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `platform.getTotalStake` method.
 * Get the total amount of stake on a Subnet.
 * @property subnetID - The ID of the Subnet to get total stake for
 */
export type GetTotalStakeParameters = {
  subnetID: string;
};

/**
 * Return type for the `platform.getTotalStake` method.
 * @property weight - The total weight of all validators on the Subnet
 * @property stake - The total amount of stake on the Subnet
 */
export type GetTotalStakeReturnType = {
  weight: number;
  stake?: number;
};

export type GetTotalStakeErrorType = RequestErrorType;

export type GetTotalStakeMethod = {
  Method: "platform.getTotalStake";
  Parameters: GetTotalStakeParameters;
  ReturnType: GetTotalStakeReturnType;
};
