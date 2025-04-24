import { RequestErrorType } from "viem/utils";
import { XChainTransactionStatus } from "./common.js";

export type GetTxStatusParameters = {
    txID: string;
    includeReason?: boolean | true;
}

export type GetTxStatusReturnType = {
    status: XChainTransactionStatus;
    resson?: string;
}

export type GetTxStatusErrorType = RequestErrorType;

export type GetTxStatusMethod = {
    Method: "avm.getTxStatus";
    Parameters: GetTxStatusParameters;
    ReturnType: GetTxStatusReturnType;
}