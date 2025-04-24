import { RequestErrorType } from "viem/utils";

export type GetContainerByIDParameters = {
    id: string;
    encoding: string;
}

export type GetContainerByIDReturnType = {
    id: string;
    bytes: string;
    timestamp: string;
    encoding: string;
    index: string;
}

export type GetContainerByIDErrorType = RequestErrorType;

export type GetContainerByIDMethod = {
    Method: "index.getContainerByID";
    Parameters: GetContainerByIDParameters;
    ReturnType: GetContainerByIDReturnType;
}
