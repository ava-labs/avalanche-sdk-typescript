import { RequestErrorType } from "viem/utils";
import { PChainTransactionStatus } from "./common.js";

export type GetTxStatusParameters = {
    txID: string;
};

export type GetTxStatusReturnType = {
    status: PChainTransactionStatus;
    reason?: string;
};

export type GetTxStatusErrorType = RequestErrorType;

export type GetTxStatusMethod = {
    Method: "platform.getTxStatus";
    Parameters: GetTxStatusParameters;
    ReturnType: GetTxStatusReturnType;
};

