import { RequestErrorType } from "viem/utils";

export type GetAtomicTxParameters = {
  txID: string;
  encoding?: "hex";
};

export type GetAtomicTxReturnType = {
  tx: string;
  blockHeight: string;
  encoding: "hex";
};

export type GetAtomicTxErrorType = RequestErrorType;

export type GetAtomicTxMethod = {
  Method: "avax.getAtomicTx";
  Params: GetAtomicTxParameters;
  Result: GetAtomicTxReturnType;
};
