import {
  avmSerial,
  Common,
  Context as ContextType,
} from "@avalabs/avalanchejs";
import { C_CHAIN_ALIAS, P_CHAIN_ALIAS, X_CHAIN_ALIAS } from "../../../consts";
import { CommonTxParams, Output } from "../../types/common";

export type PrepareExportTxnParameters = CommonTxParams & {
  /**
   * The chain to export the funds to.
   */
  destinationChain: typeof P_CHAIN_ALIAS | typeof C_CHAIN_ALIAS;
  /**
   * The outputs to export.
   */
  exportedOutputs: Output[];
  /**
   * The context to use for the transaction.
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
  exportTx: avmSerial.ExportTx;
  /**
   * The chain alias.
   */
  chainAlias: typeof X_CHAIN_ALIAS;
};
