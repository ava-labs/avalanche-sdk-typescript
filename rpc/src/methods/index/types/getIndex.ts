import { RequestErrorType } from "viem/utils";

export type GetIndexParameters = {
    id: string;
    encoding: string;
}

export type GetIndexReturnType = {
    index: string;
}

export type GetIndexErrorType = RequestErrorType;

export type GetIndexMethod = {
    Method: "index.getIndex";
    Parameters: GetIndexParameters;
    ReturnType: GetIndexReturnType;
}