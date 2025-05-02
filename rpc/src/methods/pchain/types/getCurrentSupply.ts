import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `platform.getCurrentSupply` method.
 * Get the current supply of a token.
 * @property subnetId - The ID of the Subnet to get the supply for. If omitted, gets supply for the Primary Network
 */
export type GetCurrentSupplyParameters = {
  subnetId?: string;
};

/**
 * Return type for the `platform.getCurrentSupply` method.
 * @property supply - An upper bound on the number of tokens that exist
 */
export type GetCurrentSupplyReturnType = {
  /**
   * An upper bound on the number of tokens that exist.
   */
  supply: bigint;
};

export type GetCurrentSupplyErrorType = RequestErrorType;

export type GetCurrentSupplyMethod = {
  Method: "platform.getCurrentSupply";
  Parameters: GetCurrentSupplyParameters;
  ReturnType: GetCurrentSupplyReturnType;
};
