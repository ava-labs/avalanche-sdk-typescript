import { RequestErrorType } from "viem/utils";
import { Encoding, PChainBlockType } from "./common.js";

/**
 * Parameters for the {@link getBlockByHeight} function.
 */
export type GetBlockByHeightParameters = {
    /**
     * The block height to query.
     */
    height: number;
  
    /**
     * The encoding format to use. Can be either 'hex' or 'json'. Defaults to 'hex'.
     */
    encoding?: Encoding;
  };
  
  /**
   * The return type for the {@link getBlockByHeight} function.
   */
  export type GetBlockByHeightReturnType = PChainBlockType;
  
  /**
   * The error type for the {@link getBlockByHeight} function.
   */
  export type GetBlockByHeightErrorType = RequestErrorType;
  
  /**
   * Method definition for the 'platform.getBlockByHeight' RPC call.
   */
  export type GetBlockByHeightMethod = {
    Method: 'platform.getBlockByHeight';
    Parameters: GetBlockByHeightParameters;
    ReturnType: GetBlockByHeightReturnType;
  };
  