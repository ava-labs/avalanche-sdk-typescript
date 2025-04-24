import { RequestErrorType } from "viem/utils";

export type AliasParameters = {
    endpoint: string;
    alias: string;
}

export type AliasErrorType = RequestErrorType;

export type AliasMethod = {
    Method: "admin.alias";
    Parameters: AliasParameters;
    ReturnType: {};
}