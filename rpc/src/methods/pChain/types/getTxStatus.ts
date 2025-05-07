import { RequestErrorType } from "viem/utils";
import { PChainTransactionStatus } from "./common.js";

/**
 * Parameters for the `platform.getTxStatus` method.
 * Get the status of a transaction.
 * @property txID - The ID of the transaction to get the status of
 */
export type GetTxStatusParameters = {
  txID: string;
};

/**
 * Return type for the `platform.getTxStatus` method.
 * @property status - The status of the transaction
 * @property reason - The reason for the transaction's status, if applicable
 */
export type GetTxStatusReturnType = {
  status: PChainTransactionStatus;
  reason?: string;
};

export type GetTxStatusErrorType = RequestErrorType;

export type GetTxStatusMethod = {
  Method: "platform.getTxStatus";
  Parameters: GetTxStatusParameters;
  ReturnType: GetTxStatusReturnType;
};
