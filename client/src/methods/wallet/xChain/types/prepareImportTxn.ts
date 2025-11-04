import {
  avmSerial,
  Common,
  Context as ContextType,
} from "@avalabs/avalanchejs";
import {
  C_CHAIN_ALIAS,
  P_CHAIN_ALIAS,
  X_CHAIN_ALIAS,
} from "../../../consts.js";
import { CommonTxParams } from "../../types/common.js";

export type ImportedOutput = {
  /**
   * The addresses to import the funds to. These are the
   * addresses who can sign the consuming of this UTXO.
   */
  addresses: string[];
  /**
   * Optional. Timestamp in seconds after which this UTXO can be consumed.
   */
  locktime?: bigint;
  /**
   * Optional. The number of signatures required out of the total `addresses`
   * to spend the imported output.
   */
  threshold?: number;
};

export type PrepareImportTxnParameters = Omit<
  CommonTxParams,
  "changeAddresses"
> & {
  /**
   * The chain to import the funds from. {@link P_CHAIN_ALIAS} | {@link C_CHAIN_ALIAS}
   */
  sourceChain: typeof P_CHAIN_ALIAS | typeof C_CHAIN_ALIAS;
  /**
   * Consolidated imported output from the atomic memory (source chain). Users
   * cannot specify the amount, as it will be consolidation of all the UTXOs
   * pending for import from the source chain.
   */
  importedOutput: ImportedOutput;
  /**
   * The context to use for the transaction.
   */
  context?: ContextType.Context;
};

export type PrepareImportTxnReturnType = {
  /**
   * The unsigned transaction.
   */
  tx: Common.UnsignedTx;
  /**
   * The import transaction instance.
   */
  importTx: avmSerial.ImportTx;
  /**
   * The chain alias. {@link X_CHAIN_ALIAS}
   */
  chainAlias: typeof X_CHAIN_ALIAS;
};
