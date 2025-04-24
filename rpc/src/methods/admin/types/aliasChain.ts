import { RequestErrorType } from "viem/utils";

export type AliasChainParameters = {
    chain: string;
    alias: string;
}

export type AliasChainErrorType = RequestErrorType;

export type AliasChainMethod = {
    Method: "admin.aliasChain";
    Parameters: AliasChainParameters;
    ReturnType: {};
}