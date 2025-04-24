import { RequestErrorType } from "viem/utils";

export type GetNodeIPReturnType = {
    ip: string;
}

export type GetNodeIPErrorType = RequestErrorType;

export type GetNodeIPMethod = {
    Method: "info.getNodeIP";
    Parameters: {};
    ReturnType: GetNodeIPReturnType;
}