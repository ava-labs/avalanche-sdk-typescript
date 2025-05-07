import { RequestErrorType } from "viem/utils";

/**
 * Return type for the `platform.getTimestamp` method.
 * Get the current timestamp of the P-Chain.
 * @property timestamp - The current timestamp in ISO 8601 format
 */
export type GetTimestampReturnType = {
  timestamp: string;
};

export type GetTimestampErrorType = RequestErrorType;

export type GetTimestampMethod = {
  Method: "platform.getTimestamp";
  Parameters: {};
  ReturnType: GetTimestampReturnType;
};
