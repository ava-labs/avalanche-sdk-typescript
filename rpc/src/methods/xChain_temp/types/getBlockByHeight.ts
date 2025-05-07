import { RequestErrorType } from "viem/utils";
import { XChainBlockType } from "./common.js";

/**
 * The parameters for the `avm.getBlockByHeight` method.
 *
 * @property height - The height of the block to get.
 * @property encoding - The encoding of the block. Only "hex" or "json" are supported.
 */
export type GetBlockByHeightParameters = {
  height: number;
  encoding?: "hex" | "json";
};

/**
 * The return type for the `avm.getBlockByHeight` method.
 *
 * @see {@link XChainBlockType}
 */
export type GetBlockByHeightReturnType = XChainBlockType;

export type GetBlockByHeightErrorType = RequestErrorType;

export type GetBlockByHeightMethod = {
  Method: "avm.getBlockByHeight";
  Parameters: GetBlockByHeightParameters;
  ReturnType: GetBlockByHeightReturnType;
};
