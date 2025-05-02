import { RequestErrorType } from "viem/utils";
import { XChainTransactionType } from "./common.js";

/**
 * Parameters for the `avm.getTx` method.
 *
 * @property txID - The ID of the transaction to retrieve
 * @property encoding - The encoding format for the transaction data. Defaults to "json" if not specified.
 */
export type GetTxParameters = {
  txID: string;
  encoding?: "hex" | "json";
};

/**
 * Return type for the `avm.getTx` method.
 * Returns the transaction in the requested format.
 * @see {@link XChainTransactionType} for detailed structure
 */
export type GetTxReturnType = XChainTransactionType;

export type GetTxErrorType = RequestErrorType;

export type GetTxMethod = {
  Method: "avm.getTx";
  Parameters: GetTxParameters;
  ReturnType: GetTxReturnType;
};
