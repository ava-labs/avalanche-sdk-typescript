import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `platform.sampleValidators` method.
 * Sample validators from the specified Subnet.
 * @property size - The number of validators to sample
 * @property subnetID - The Subnet to sample from. If omitted, defaults to the Primary Network
 */
export type SampleValidatorsParameters = {
  size: number;
  subnetID?: string;
};

/**
 * Return type for the `platform.sampleValidators` method.
 * @property validators - The IDs of the sampled validators
 */
export type SampleValidatorsReturnType = {
  validators: string[];
};

export type SampleValidatorsErrorType = RequestErrorType;

export type SampleValidatorsMethod = {
  Method: "platform.sampleValidators";
  Parameters: SampleValidatorsParameters;
  ReturnType: SampleValidatorsReturnType;
};
