import { Common, Context as ContextType } from "@avalabs/avalanchejs";
import { CommonTxParams, Output } from "../../types/common.js";

export type PrepareExportTxnParameters = CommonTxParams & {
  /**
   * The chain to export the funds to.
   */
  destinationChain: "X" | "C";
  /**
   * The outputs to export.
   */
  exportedOutputs: Output[];
  /**
   * Optional. The context to use for the transaction. If not provided, the context will be fetched.
   */
  context?: ContextType.Context;
};

export type PrepareExportTxnReturnType = {
  tx: Common.UnsignedTx;
  chainAlias: "P";
};
