import { RequestErrorType } from "viem/utils";

export type GetBlockchainIDParameters = {
    alias: string;
}

export type GetBlockchainIDReturnType = {
    blockchainID: string;
}

export type GetBlockchainIDErrorType = RequestErrorType;

export type GetBlockchainIDMethod = {
    Method: "info.getBlockchainID";
    Parameters: GetBlockchainIDParameters;
    ReturnType: GetBlockchainIDReturnType;
}