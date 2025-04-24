import { RequestErrorType } from "viem/utils";

export type GetContainerRangeParameters = {
    startIndex: string;
    numToFetch: string;
    encoding: string;
}

export type GetContainerRangeReturnType = {
    id: string;
    bytes: string;
    timestamp: string;
    encoding: string;
    index: string;
}

export type GetContainerRangeErrorType = RequestErrorType;

export type GetContainerRangeMethod = {
    Method: "index.getContainerRange";
    Parameters: GetContainerRangeParameters;
    ReturnType: GetContainerRangeReturnType;
}