import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `platform.getStake` method.
 * Get the amount of stake for a set of addresses.
 * @property addresses - The addresses to get stake for
 * @property validatorsOnly - If true, only return stake for addresses that are validators
 */
export type GetStakeParameters = {
  addresses: string[];
  validatorsOnly?: boolean;
};

/**
 * Return type for the `platform.getStake` method.
 * @property staked - The total amount of stake
 * @property stakeds - A map of addresses to their stake amounts
 * @property stakedOutputs - The UTXOs that contain the stake
 * @property encoding - The encoding format used
 */
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
