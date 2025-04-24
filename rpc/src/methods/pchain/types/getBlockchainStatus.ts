import { RequestErrorType } from "viem/utils";
import { BlockchainStatus } from "./common.js";

export type GetBlockchainStatusParameters = {
    blockchainId: string;
};

export type GetBlockchainStatusReturnType = {
    status: BlockchainStatus;
};

export type GetBlockchainStatusErrorType = RequestErrorType;

export type GetBlockchainStatusMethod = {
    Method: "platform.getBlockchainStatus";
    Parameters: GetBlockchainStatusParameters;
    ReturnType: GetBlockchainStatusReturnType;
};