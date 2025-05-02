import { RequestErrorType } from "viem/utils";
import { Encoding, PChainBlockType } from "./common.js";

/**
 * Parameters for the `platform.getBlockByHeight` method.
 * Get a block by its height.
 * @property height - The block height to query
 * @property encoding - The encoding format to use. Can be either 'hex' or 'json'. Defaults to 'hex'
 */
export type GetBlockByHeightParameters = {
  height: number;
  encoding?: Encoding;
};

/**
 * The return type for the `platform.getBlockByHeight` method.
 *
 * @see {@link PChainBlockType}
 */
export type GetBlockByHeightReturnType = PChainBlockType;

export type GetBlockByHeightErrorType = RequestErrorType;

export type GetBlockByHeightMethod = {
  Method: "platform.getBlockByHeight";
  Parameters: GetBlockByHeightParameters;
  ReturnType: GetBlockByHeightReturnType;
};
