import { RequestErrorType } from "viem/utils";

/**
 * Return type for the proposervm.getCurrentEpoch method.
 * @property number - The current epoch number
 * @property startTime - The epoch start time (Unix timestamp)
 * @property pChainHeight - The P-Chain height at the start of this epoch
 */
export type GetCurrentEpochReturnType = {
  number: string;
  startTime: string;
  pChainHeight: string;
};

export type GetCurrentEpochErrorType = RequestErrorType;

export type GetCurrentEpochMethod = {
  Method: "proposervm.getCurrentEpoch";
  Parameters: {};
  ReturnType: GetCurrentEpochReturnType;
};
