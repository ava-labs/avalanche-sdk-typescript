import { RequestErrorType } from "viem/utils";

export type IsBootstrappedParameters = {
    chain: string;
}

export type IsBootstrappedReturnType = {
    isBootstrapped: boolean;
}

export type IsBootstrappedErrorType = RequestErrorType;

export type IsBootstrappedMethod = {
    Method: "info.isBootstrapped";
    Parameters: IsBootstrappedParameters;
    ReturnType: IsBootstrappedReturnType;
}