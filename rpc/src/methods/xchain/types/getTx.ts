import { RequestErrorType } from "viem/utils";
import { XChainTransactionType } from "./common.js";

export type GetTxParameters = {
    txID: string;
    encoding?: "hex" | "json";
}

export type GetTxReturnType = XChainTransactionType;

export type GetTxErrorType = RequestErrorType;

export type GetTxMethod = {
    Method: "avm.getTx";
    Parameters: GetTxParameters;
    ReturnType: GetTxReturnType;
}