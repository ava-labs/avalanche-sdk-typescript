import {
  Common,
  Context as ContextType,
  evmSerial,
} from "@avalabs/avalanchejs";
import { P_CHAIN_ALIAS, X_CHAIN_ALIAS } from "../../../consts.js";

export type PrepareExportTxnParameters = {
  /**
   * The chain alias to export the funds to.
   */
  destinationChain: typeof P_CHAIN_ALIAS | typeof X_CHAIN_ALIAS;
  /**
   * The EVM address to export the funds from.
   */
  fromAddress: string;
  /**
   * The consolidated exported output (UTXO)
   */
  exportedOutput: {
    /**
     * Addresses who can sign the consuming of this UTXO.
     */
    addresses: string[];
    /**
     * The amount (in AVAX) held by this exported output.
     */
    amount: number;
    /**
     * Optional. Timestamp in seconds after which this UTXO can be consumed.
     */
    locktime?: number;
    /**
     * Optional. Threshold of `addresses`' signatures required to consume this UTXO.
     */
    threshold?: number;
  };
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
  exportTx: evmSerial.ExportTx;
  /**
   * The chain alias.
   */
  chainAlias: "C";
};
