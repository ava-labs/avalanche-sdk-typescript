import { RequestErrorType } from "viem/utils";
import { XChainBlockType } from "./common.js";

export type GetBlockParameters = {
    blockId: string;
    encoding?: "hex" | "json";
};

export type GetBlockReturnType = XChainBlockType;

export type GetBlockErrorType = RequestErrorType;

export type GetBlockMethod = {
    Method: "avm.getBlock";
    Parameters: GetBlockParameters;
    ReturnType: GetBlockReturnType;
};