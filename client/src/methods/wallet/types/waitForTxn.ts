import { RequestErrorType } from "viem/utils";

export type WaitForTxnParameters = {
  txHash: string;
  chainAlias: "X" | "P" | "C";
  sleepTime?: number;
  maxRetries?: number;
};

export type WaitForTxnErrorType = RequestErrorType;
