import { RequestErrorType } from "viem/utils";

export type ValidatesParameters = {
  subnetID: string;
};

export type ValidatesReturnType = {
  blockchainIDs: string[];
};

export type ValidatesErrorType = RequestErrorType;

export type ValidatesMethod = {
  Method: "platform.validates";
  Parameters: ValidatesParameters;
  ReturnType: ValidatesReturnType;
};
