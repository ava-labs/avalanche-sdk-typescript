import {
  Common,
  Context as ContextType,
  pvmSerial,
} from "@avalabs/avalanchejs";
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
  locktime?: number;
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
   * The chain to import the funds from.
   */
  sourceChain: "X" | "C";
  /**
   * Consolidated imported output from the atomic memory (source chain). Users
   * cannot specify the amount, as it will be consolidation of all the UTXOs
   * pending for import from the source chain.
   */
  importedOutput: ImportedOutput;
  /**
   * Optional. The context to use for the transaction. If not provided, the context will be fetched.
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
  importTx: pvmSerial.ImportTx;
  /**
   * The chain alias.
   */
  chainAlias: "P";
};
