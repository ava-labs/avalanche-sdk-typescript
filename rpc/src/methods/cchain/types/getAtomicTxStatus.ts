import { RequestErrorType } from "viem/utils";

export type GetAtomicTxStatusParameters = {
  txID: string;
};

export type GetAtomicTxStatusReturnType = {
    status: string;
    blockHeight: string;
};

export type GetAtomicTxStatusErrorType = RequestErrorType;

export type GetAtomicTxStatusMethod = {
  Method: "avax.getAtomicTxStatus";
  Params: GetAtomicTxStatusParameters;
  Result: GetAtomicTxStatusReturnType;
};
