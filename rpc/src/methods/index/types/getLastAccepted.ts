import { RequestErrorType } from "viem/utils";

export type GetLastAcceptedParameters = {
    encoding: string;
}

export type GetLastAcceptedReturnType = {
    id: string;
    bytes: string;
    timestamp: string;
    encoding: string;
    index: string;
}

export type GetLastAcceptedErrorType = RequestErrorType;

export type GetLastAcceptedMethod = {
    Method: "index.getLastAccepted";
    Parameters: GetLastAcceptedParameters;
    ReturnType: GetLastAcceptedReturnType;
}