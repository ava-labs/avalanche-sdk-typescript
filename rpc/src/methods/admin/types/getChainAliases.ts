import { RequestErrorType } from "viem/utils";

export type GetChainAliasesParameters = {
    chain: string;
}

export type GetChainAliasesReturnType = {
    aliases: string[];
}

export type GetChainAliasesErrorType = RequestErrorType;

export type GetChainAliasesMethod = {
    Method: "admin.getChainAliases";
    Parameters: GetChainAliasesParameters;
    ReturnType: GetChainAliasesReturnType;
}
