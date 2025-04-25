import { RequestErrorType } from "viem/utils";
import { CChainAtomicTxStatus } from "./common.js";

export type GetAtomicTxStatusParameters = {
  txID: string;
};

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
