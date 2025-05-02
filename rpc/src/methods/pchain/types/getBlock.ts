import { RequestErrorType } from "viem/utils";
import { Encoding, PChainBlockType } from "./common.js";

/**
 * Parameters for the `platform.getBlock` method.
 * Get a block by its ID.
 * @property blockId - The block ID. It should be in cb58 format
 * @property encoding - The encoding format to use. Can be either hex or json. Defaults to hex
 */
export type GetBlockParameters = {
  /**
   * The block ID. It should be in cb58 format.
   */
  blockId: string;

  /**
   * The encoding format to use. Can be either hex or json. Defaults to hex.
   */
  encoding?: Encoding;
};

/**
 * The return type for the `platform.getBlock` method.
 *
 * @see {@link PChainBlockType}
 */
export type GetBlockReturnType = PChainBlockType;

export type GetBlockErrorType = RequestErrorType;

export type GetBlockMethod = {
  Method: "platform.getBlock";
  Parameters: GetBlockParameters;
  ReturnType: GetBlockReturnType;
};
