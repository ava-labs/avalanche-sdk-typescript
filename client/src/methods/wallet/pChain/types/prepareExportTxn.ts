import {
  Common,
  Context as ContextType,
  pvmSerial,
} from "@avalabs/avalanchejs";
import {
  C_CHAIN_ALIAS,
  P_CHAIN_ALIAS,
  X_CHAIN_ALIAS,
} from "../../../consts.js";
import { CommonTxParams, Output } from "../../types/common.js";

export type PrepareExportTxnParameters = CommonTxParams & {
  /**
   * The chain to export the funds to. {@link X_CHAIN_ALIAS} | {@link C_CHAIN_ALIAS}
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
  /**
   * The unsigned transaction.
   */
  tx: Common.UnsignedTx;
  /**
   * The export transaction instance.
   */
  exportTx: pvmSerial.ExportTx;
  /**
   * The chain alias. {@link P_CHAIN_ALIAS}
   */
  chainAlias: typeof P_CHAIN_ALIAS;
};
