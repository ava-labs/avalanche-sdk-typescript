import { UnsignedTx } from "@avalabs/avalanchejs";
import { Address } from "viem";
import { RequestErrorType } from "viem/utils";
import { AvalancheAccount } from "../../../accounts/avalancheAccount.js";

/**
 * The parameters for the signXPTransaction method
 * @property account - Optional, the account to use for the transaction. {@link AvalancheAccount}, {@link Address}
 * @property txOrTxHex - The transaction to sign, either a hex string or an UnsignedTx object. {@link string} or {@link UnsignedTx}
 * @property chainAlias - The chain to sign the transaction on. {@link "X"} or {@link "P"}
 * @property utxoIds - Optional, the utxo ids to use for the transaction. {@link string[]}
 */
export type SignXPTransactionParameters = {
  account?: AvalancheAccount | Address | undefined;
  txOrTxHex: string | UnsignedTx;
  chainAlias: "X" | "P";
  utxoIds?: string[] | undefined;
};

/**
 * The signatures for the transaction
 * @property signature - The signature of the transaction with the current account {@link string}
 * @property sigIndices - The indices of the signatures. Contains [inputIndex, signatureIndex] pair. {@link number[]}
 */
export type Signatures = {
  signature: string;
  sigIndices: number[];
};

/**
 * The return type for the signXPTransaction method
 * @property signedTxHex - The signed transaction in hex format. {@link string}
 * @property signatures - The signatures array for the transaction. {@link Signatures}
 */
export type SignXPTransactionReturnType = {
  signedTxHex: string;
  signatures: Signatures[];
};

export type SignXPTransactionErrorType = RequestErrorType;

export type SignXPTransactionMethod = {
  Method: "avalanche_signTransaction";
  Parameters: Omit<SignXPTransactionParameters, "account">;
  ReturnType: SignXPTransactionReturnType;
};
