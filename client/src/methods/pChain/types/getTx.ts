import { RequestErrorType } from "viem/utils";
import { Encoding, PChainTransactionType } from "./common.js";

/**
 * Parameters for the `platform.getTx` method.
 * Get a transaction by its ID.
 * @property txID - The ID of the transaction to get
 * @property encoding - Optional. The encoding format to use. Can be either hex or json. Defaults to hex
 */
export type GetTxParameters = {
  txID: string;
  encoding?: Encoding;
};

/**
 * Return type for the `platform.getTx` method.
 * Returns the transaction encoded to the specified format {@link PChainTransactionType}
 */
export type GetTxReturnType = PChainTransactionType;

export type GetTxErrorType = RequestErrorType;

export type GetTxMethod = {
  Method: "platform.getTx";
  Parameters: GetTxParameters;
  ReturnType: GetTxReturnType;
};
