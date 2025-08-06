import { RequestErrorType } from "viem/utils";
import { CChainAtomicTxStatus } from "./common.js";

/**
 * The parameters for the `avax.getAtomicTxStatus` method.
 *
 * @param txID - The ID of the atomic transaction. It should be in cb58 format.
 */
export type GetAtomicTxStatusParameters = {
  txID: string;
};

/**
 * The return type for the `avax.getAtomicTxStatus` method.
 *
 * @param status - The status of the atomic transaction. {@link CChainAtomicTxStatus}
 * @param blockHeight - The height of the block which the transaction was included in.
 */
export type GetAtomicTxStatusReturnType = {
  status: CChainAtomicTxStatus;
  blockHeight: string;
};

export type GetAtomicTxStatusErrorType = RequestErrorType;

export type GetAtomicTxStatusMethod = {
  Method: "avax.getAtomicTxStatus";
  Parameters: GetAtomicTxStatusParameters;
  ReturnType: GetAtomicTxStatusReturnType;
};
