import { RequestErrorType } from "viem/utils";
import { Encoding, PChainBlockType } from "./common.js";

export type GetPChainBlockParameters = {
  /**
   * The block ID. It should be in cb58 format.
   */
  blockId: string;

  /**
   * The encoding format to use. Can be either hex or json. Defaults to hex.
   */
  encoding?: Encoding;
};

export type GetPChainBlockReturnType = PChainBlockType

export type GetPChainBlockErrorType = RequestErrorType;

export type GetPChainBlockMethod = {
  Method: "platform.getBlock";
  Parameters: GetPChainBlockParameters;
  ReturnType: GetPChainBlockReturnType;
};
