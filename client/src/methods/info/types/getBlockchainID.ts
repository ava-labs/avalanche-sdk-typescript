import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the info.getBlockchainID method.
 * @property alias - The blockchain's alias (e.g. "X" for X-Chain)
 */
export type GetBlockchainIDParameters = {
  alias: string;
};

/**
 * Return type for the info.getBlockchainID method.
 * @property blockchainID - The ID of the blockchain
 */
export type GetBlockchainIDReturnType = {
  blockchainID: string;
};

export type GetBlockchainIDErrorType = RequestErrorType;

export type GetBlockchainIDMethod = {
  Method: "info.getBlockchainID";
  Parameters: GetBlockchainIDParameters;
  ReturnType: GetBlockchainIDReturnType;
};
