import { Common, Context as ContextType } from "@avalabs/avalanchejs";
import { CommonTxParams, Output } from "../../types/common.js";

export type PrepareBaseTxnParameters = CommonTxParams & {
  /**
   * Optional. Outputs to send funds to. It can
   * be used to specify resulting UTXOs.
   */
  outputs?: Output[];
  /**
   * Optional. The context to use for the transaction. If not provided, the context will be fetched.
   */
  context?: ContextType.Context;
};

export type PrepareBaseTxnReturnType = {
  tx: Common.UnsignedTx;
  chainAlias: "P";
};
