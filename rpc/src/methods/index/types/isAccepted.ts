import { RequestErrorType } from "viem/utils";

export type IsAcceptedParameters = {
    id: string;
    encoding: string;
}

export type IsAcceptedReturnType = {
    isAccepted: boolean;
}

export type IsAcceptedErrorType = RequestErrorType;

export type IsAcceptedMethod = {
    Method: "index.isAccepted";
    Parameters: IsAcceptedParameters;
    ReturnType: IsAcceptedReturnType;
}