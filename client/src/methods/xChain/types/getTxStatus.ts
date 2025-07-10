import { RequestErrorType } from "viem/utils";
import { XChainTransactionStatus } from "./common.js";

/**
 * The parameters for the `avm.getTxStatus` method.
 *
 * @property txID - The ID of the transaction to get the status of.
 * @property includeReason - Whether to include the reason for the status.
 */
export type GetTxStatusParameters = {
  txID: string;
  includeReason?: boolean | true;
};

/**
 * The return type for the `avm.getTxStatus` method.
 *
 * @property status - The status of the transaction.
 * @property reason - The reason for the status.
 */
export type GetTxStatusReturnType = {
  status: XChainTransactionStatus;
  reason?: string;
};

export type GetTxStatusErrorType = RequestErrorType;

export type GetTxStatusMethod = {
  Method: "avm.getTxStatus";
  Parameters: GetTxStatusParameters;
  ReturnType: GetTxStatusReturnType;
};
