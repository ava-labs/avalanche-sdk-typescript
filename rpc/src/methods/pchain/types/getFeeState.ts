import { RequestErrorType } from "viem/utils";

/**
 * Return type for the `platform.getFeeState` method.
 * Get the current fee state of the P-Chain.
 * @property capacity - The current capacity of the fee market
 * @property excess - The current excess of the fee market
 * @property price - The current price of the fee market
 * @property timestamp - The timestamp of the fee state in ISO8601 format
 */
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
