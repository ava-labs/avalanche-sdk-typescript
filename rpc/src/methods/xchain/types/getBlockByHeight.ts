import { RequestErrorType } from "viem/utils";
import { XChainBlockType } from "./common.js";

export type GetBlockByHeightParameters = {
    height: number;
    encoding?: "hex" | "json";
}

export type GetBlockByHeightReturnType = XChainBlockType;

export type GetBlockByHeightErrorType = RequestErrorType;

export type GetBlockByHeightMethod = {
    Method: "avm.getBlockByHeight";
    Parameters: GetBlockByHeightParameters;
    ReturnType: GetBlockByHeightReturnType;
};
