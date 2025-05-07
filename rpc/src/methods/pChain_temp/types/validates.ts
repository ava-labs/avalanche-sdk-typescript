import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `platform.validates` method.
 * Get the IDs of the blockchains a Subnet validates.
 * @property subnetID - The Subnet's ID
 */
export type ValidatesParameters = {
  subnetID: string;
};

/**
 * Return type for the `platform.validates` method.
 * @property blockchainIDs - The IDs of the blockchains the Subnet validates
 */
export type ValidatesReturnType = {
  blockchainIDs: string[];
};

export type ValidatesErrorType = RequestErrorType;

export type ValidatesMethod = {
  Method: "platform.validates";
  Parameters: ValidatesParameters;
  ReturnType: ValidatesReturnType;
};
