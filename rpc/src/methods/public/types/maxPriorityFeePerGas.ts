import { RequestErrorType } from "viem/utils";

/**
 * The return type for the `eth_maxPriorityFeePerGas` method.
 *
 * @param maxPriorityFeePerGas - The maximum priority fee per gas for the next block.
 */
export type MaxPriorityFeePerGasReturnType = string;

export type MaxPriorityFeePerGasErrorType = RequestErrorType;

export type MaxPriorityFeePerGasMethod = {
  Method: "eth_maxPriorityFeePerGas";
  Parameters: [];
  ReturnType: MaxPriorityFeePerGasReturnType;
};
