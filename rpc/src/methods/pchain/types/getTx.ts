import { RequestErrorType } from "viem/utils";
import { Encoding, PChainTransactionType } from "./common.js";

export type GetTxParameters = {
    txID: string;
    encoding: Encoding;
};

export type GetTxReturnType = PChainTransactionType;

export type GetTxErrorType = RequestErrorType;

export type GetTxMethod = {
    Method: "platform.getTx";
    Parameters: GetTxParameters;
    ReturnType: GetTxReturnType;
};