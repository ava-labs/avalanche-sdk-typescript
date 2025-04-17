import { RequestErrorType } from "viem/utils";
import { TransactionStatus } from "./common.js";

export type GetTxStatusParameters = {
    txID: string;
};

export type GetTxStatusReturnType = {
    status: TransactionStatus;
    reason?: string;
};

export type GetTxStatusErrorType = RequestErrorType;

export type GetTxStatusMethod = {
    Method: "platform.getTxStatus";
    Parameters: GetTxStatusParameters;
    ReturnType: GetTxStatusReturnType;
};

