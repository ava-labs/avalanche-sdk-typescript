import { RequestErrorType } from "viem/utils";

/**
 * The parameters for the `avax.getAtomicTx` method.
 *
 * @param txID - The ID of the atomic transaction. It should be in cb58 format.
 * @param encoding - The encoding of the transaction.
 */
export type GetAtomicTxParameters = {
  txID: string;
  encoding?: "hex";
};

/**
 * The return type for the `avax.getAtomicTx` method.
 *
 * @param tx - The atomic transaction.
 * @param blockHeight - The height of the block which the transaction was included in.
 * @param encoding - The encoding of the transaction.
 */
export type GetAtomicTxReturnType = {
  tx: string;
  blockHeight: string;
  encoding: "hex";
};

export type GetAtomicTxErrorType = RequestErrorType;

export type GetAtomicTxMethod = {
  Method: "avax.getAtomicTx";
  Parameters: GetAtomicTxParameters;
  ReturnType: GetAtomicTxReturnType;
};
