import { RequestErrorType } from "viem/utils";
import { BlockchainStatus } from "./common.js";

/**
 * Parameters for the `platform.getBlockchainStatus` method.
 * Get the status of a blockchain.
 * @property blockchainId - The ID of the blockchain to get the status for
 */
export type GetBlockchainStatusParameters = {
  blockchainId: string;
};

/**
 * Return type for the `platform.getBlockchainStatus` method.
 * @property status - The status of the blockchain
 */
export type GetBlockchainStatusReturnType = {
  status: BlockchainStatus;
};

export type GetBlockchainStatusErrorType = RequestErrorType;

export type GetBlockchainStatusMethod = {
  Method: "platform.getBlockchainStatus";
  Parameters: GetBlockchainStatusParameters;
  ReturnType: GetBlockchainStatusReturnType;
};
