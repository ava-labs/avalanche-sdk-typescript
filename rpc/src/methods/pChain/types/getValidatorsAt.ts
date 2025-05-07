import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `platform.getValidatorsAt` method.
 * Get the validators at a given height.
 * @property height - The height to get validators at
 * @property subnetID - The Subnet to get validators from. If omitted, gets validators from the Primary Network
 */
export type GetValidatorsAtParameters = {
  height: number;
  subnetID?: string;
};

/**
 * Return type for the `platform.getValidatorsAt` method.
 * @property validators - A map of validator IDs to their stake amounts
 */
export type GetValidatorsAtReturnType = {
  validators: Record<string, number>;
};

export type GetValidatorsAtErrorType = RequestErrorType;

export type GetValidatorsAtMethod = {
  Method: "platform.getValidatorsAt";
  Parameters: GetValidatorsAtParameters;
  ReturnType: GetValidatorsAtReturnType;
};
