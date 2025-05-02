import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `platform.validatedBy` method.
 * Get the Subnet that validates a given blockchain.
 * @property blockchainID - The blockchain's ID
 */
export type ValidatedByParameters = {
  blockchainID: string;
};

/**
 * Return type for the `platform.validatedBy` method.
 * @property subnetID - The ID of the Subnet that validates the blockchain
 */
export type ValidatedByReturnType = {
  subnetID: string;
};

export type ValidatedByErrorType = RequestErrorType;

export type ValidatedByMethod = {
  Method: "platform.validatedBy";
  Parameters: ValidatedByParameters;
  ReturnType: ValidatedByReturnType;
};
