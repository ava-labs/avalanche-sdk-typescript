import { RequestErrorType } from "viem/utils";

export type SetLogLevelParameters = {
  level: string;
};

export type SetLogLevelErrorType = RequestErrorType;

export type SetLogLevelMethod = {
  Method: "admin.setLogLevel";
  Parameters: SetLogLevelParameters;
  ReturnType: {};
};
