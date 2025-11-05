import { Context as ContextType } from "@avalabs/avalanchejs";
import { Address } from "viem";
import { RequestErrorType } from "viem/utils";
import {
  AvalancheAccount,
  XPAddress,
} from "../../../accounts/avalancheAccount.js";
/**
 *  The parameters for the send method.
 */
export type SendParameters = {
  /**
   * The account to send the transaction from.
   */
  account?: AvalancheAccount;
  /**
   * The amount of AVAX tokens to send in wei.
   */
  amount: bigint;
  /**
   * The address to send the tokens to. If the destination chain is P, this should be a P chain address. If the destination chain is C, this should be a C chain address.
   */
  to: Address | XPAddress;
  /**
   * The address to send the tokens from. Default is the account address.
   */
  from?: Address | XPAddress | undefined;
  /**
   * The chain to send the tokens from. Default is C. Only P and C are supported.
   */
  sourceChain?: "P" | "C" | undefined;
  /**
   * The chain to send the tokens to. Default is C. Only P and C are supported.
   */
  destinationChain?: "P" | "C" | undefined;
  /**
   * The token to send. Default is AVAX. Only AVAX is supported.
   */
  token?: "AVAX" | undefined;
  /**
   * Optional. The context to use for the transaction. If not provided, the context will be fetched.
   */
  context?: ContextType.Context;
};

export type SendErrorType = RequestErrorType;

/**
 *  The details of a transaction.
 */
export type TransactionDetails = {
  /**
   * The hash of the transaction.
   */
  txHash: string;
  /**
   * The chain alias of the transaction.
   */
  chainAlias: "P" | "C";
};

export type SendReturnType = {
  /**
   * The hashes of the transactions. {@link TransactionDetails[]}
   */
  txHashes: TransactionDetails[];
};
