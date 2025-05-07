import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `platform.issueTx` method.
 * Issue a transaction to the Platform Chain.
 * @property tx - The byte representation of a transaction
 * @property encoding - The encoding format for the transaction bytes. Can only be hex when a value is provided
 */
export type IssueTxParameters = {
  tx: string;
  encoding: "hex";
};

/**
 * Return type for the `platform.issueTx` method.
 * @property txID - The transaction's ID
 */
export type IssueTxReturnType = {
  txID: string;
};

export type IssueTxErrorType = RequestErrorType;

export type IssueTxMethod = {
  Method: "platform.issueTx";
  Parameters: IssueTxParameters;
  ReturnType: IssueTxReturnType;
};
