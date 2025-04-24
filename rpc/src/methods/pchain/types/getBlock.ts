import { RequestErrorType } from "viem/utils";
import { Encoding, PChainBlockType } from "./common.js";

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

export type GetBlockReturnType = PChainBlockType

export type GetBlockErrorType = RequestErrorType;

export type GetBlockMethod = {
  Method: "platform.getBlock";
  Parameters: GetBlockParameters;
  ReturnType: GetBlockReturnType;
};
