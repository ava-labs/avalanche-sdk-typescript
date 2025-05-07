import { RequestErrorType } from "viem/utils";

/**
 * The parameters for the `platform.issueTx` method.
 *
 * @param tx - The transaction to issue.
 * @param encoding - The encoding of the transaction.
 */
export type IssueTxParameters = {
  tx: string;
  encoding: "hex";
};

/**
 * The return type for the `platform.issueTx` method.
 *
 * @param txID - The ID of the issued transaction.
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
