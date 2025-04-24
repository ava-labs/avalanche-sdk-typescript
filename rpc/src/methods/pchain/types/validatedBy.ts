import { RequestErrorType } from "viem/utils";

export type ValidatedByParameters = {
  blockchainID: string;
};

export type ValidatedByReturnType = {
  subnetID: string;
};

export type ValidatedByErrorType = RequestErrorType;

export type ValidatedByMethod = {
  Method: "platform.validatedBy";
  Parameters: ValidatedByParameters;
  ReturnType: ValidatedByReturnType;
};
