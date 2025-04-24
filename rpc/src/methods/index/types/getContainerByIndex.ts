import { RequestErrorType } from "viem/utils";

export type GetContainerByIndexParameters = {
    index: string;
    encoding: string;
}

export type GetContainerByIndexReturnType = {
    id: string;
    bytes: string;
    timestamp: string;
    encoding: string;
    index: string;
}   

export type GetContainerByIndexErrorType = RequestErrorType;

export type GetContainerByIndexMethod = {
    Method: "index.getContainerByIndex";
    Parameters: GetContainerByIndexParameters;
    ReturnType: GetContainerByIndexReturnType;
}