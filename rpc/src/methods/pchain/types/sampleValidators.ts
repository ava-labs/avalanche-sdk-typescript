import { RequestErrorType } from "viem/utils";

export type SampleValidatorsParameters = {
  size: number;
  subnetID?: string;
};

export type SampleValidatorsReturnType = {
  validators: string[];
};

export type SampleValidatorsErrorType = RequestErrorType;

export type SampleValidatorsMethod = {
  Method: "platform.sampleValidators";
  Parameters: SampleValidatorsParameters;
  ReturnType: SampleValidatorsReturnType;
};
