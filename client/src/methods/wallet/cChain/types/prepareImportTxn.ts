import {
  Common,
  Context as ContextType,
  evmSerial,
  type Utxo,
} from "@avalabs/avalanchejs";
import { Address } from "viem";
import { AvalancheAccount } from "../../../../accounts/avalancheAccount.js";
import {
  C_CHAIN_ALIAS,
  P_CHAIN_ALIAS,
  X_CHAIN_ALIAS,
} from "../../../consts.js";

export type PrepareImportTxnParameters = {
  /**
   * The account to use for the transaction. {@link AvalancheAccount} or {@link Address}
   * If not provided, the account will be fetched from the client.
   */
  account?: AvalancheAccount | Address | undefined;
  /**
   * The chain alias to import the funds from. {@link P_CHAIN_ALIAS} | {@link X_CHAIN_ALIAS}
   */
  sourceChain: typeof P_CHAIN_ALIAS | typeof X_CHAIN_ALIAS;
  /**
   * The EVM address to import the funds to.
   */
  toAddress: string;
  /**
   * The addresses to import the funds from. If not provided, the wallet will be used to fetch the addresses.
   */
  fromAddresses?: string[];
  /**
   * Optional. UTXOs to use as inputs for the transaction. These UTXOs
   * must be in the atomic memory i.e. should already have been exported
   * from the source chain. If not provided, utxos will be fetched from
   * the `fromAddresses`. Preference would be given to `utxos` array.
   */
  utxos?: Utxo[];
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
  importTx: evmSerial.ImportTx;
  /**
   * The chain alias. {@link C_CHAIN_ALIAS}
   */
  chainAlias: typeof C_CHAIN_ALIAS;
};
