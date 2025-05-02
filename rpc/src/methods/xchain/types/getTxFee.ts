import { RequestErrorType } from "viem/utils";

/**
 * The return type for the `avm.getTxFee` method.
 *
 * @property txFee - The fee for the transaction.
 * @property createAssetTxFee - The fee for the create asset transaction.
 */
export type GetTxFeeReturnType = {
  txFee: number;
  createAssetTxFee: number;
};

export type GetTxFeeErrorType = RequestErrorType;

export type GetTxFeeMethod = {
  Method: "avm.getTxFee";
  Parameters: {};
  ReturnType: GetTxFeeReturnType;
};
