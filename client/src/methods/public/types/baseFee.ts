import { RequestErrorType } from "viem/utils";

/**
 * The return type for the `eth_baseFee` method.
 *
 * @param baseFee - The base fee for the next block.
 */
export type BaseFeeReturnType = string;

export type BaseFeeErrorType = RequestErrorType;

export type BaseFeeMethod = {
  Method: "eth_baseFee";
  Parameters: [];
  ReturnType: BaseFeeReturnType;
};
