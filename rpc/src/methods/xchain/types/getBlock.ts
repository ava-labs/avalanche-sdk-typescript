import { RequestErrorType } from "viem/utils";
import { XChainBlockType } from "./common.js";

/**
 * The parameters for the `avm.getBlock` method.
 *
 * @property blockId - The ID of the block to get.
 * @property encoding - The encoding of the block. Only "hex" or "json" are supported.
 */
export type GetBlockParameters = {
  blockId: string;
  encoding?: "hex" | "json";
};

/**
 * The return type for the `avm.getBlock` method.
 *
 * @see {@link XChainBlockType}
 */
export type GetBlockReturnType = XChainBlockType;

export type GetBlockErrorType = RequestErrorType;

export type GetBlockMethod = {
  Method: "avm.getBlock";
  Parameters: GetBlockParameters;
  ReturnType: GetBlockReturnType;
};
