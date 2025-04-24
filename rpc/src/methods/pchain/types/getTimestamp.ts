import { RequestErrorType } from "viem/utils";

export type GetTimestampReturnType = {
  timestamp: string;
};

export type GetTimestampErrorType = RequestErrorType;

export type GetTimestampMethod = {
  Method: "platform.getTimestamp";
  Parameters: {};
  ReturnType: GetTimestampReturnType;
};
