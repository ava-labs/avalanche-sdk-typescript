import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `avm.issueTx` method.
 * This method sends a signed transaction to the network.
 *
 * @property tx - The signed transaction in hex format
 * @property encoding - The encoding format for the transaction data. Must be "hex".
 */
export type IssueTxParameters = {
  tx: string;
  encoding: "hex";
};

/**
 * Return type for the `avm.issueTx` method.
 * Returns the ID of the issued transaction.
 *
 * @property txID - The ID of the issued transaction
 */
export type IssueTxReturnType = {
  txID: string;
};

export type IssueTxErrorType = RequestErrorType;

export type IssueTxMethod = {
  Method: "avm.issueTx";
  Parameters: IssueTxParameters;
  ReturnType: IssueTxReturnType;
};
