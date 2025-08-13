import {
  Context as ContextType,
  PChainOwner,
  UnsignedTx,
} from "@avalabs/avalanchejs";
import { Address } from "viem";
import { RequestErrorType } from "viem/utils";
import { AvalancheAccount } from "../../../accounts/avalancheAccount.js";

/**
 * The parameters for the signXPTransaction method
 * @property account - Optional, the account to use for the transaction. {@link AvalancheAccount}, {@link Address}
 * @property tx - The transaction to sign, either a hex string or an UnsignedTx object. `string` or {@link UnsignedTx}
 * @property signedTxHex - The signed transaction in hex format. `string`
 * @property chainAlias - The chain to sign the transaction on. `"X" | "P" | "C"`
 * @property utxoIds - Optional, the utxo ids to use for the transaction. `string[]`
 * @property subnetAuth - Optional, the subnet auth to use for the transaction. `number[]`
 * @property subnetOwners - Optional, the subnet owners to use for the transaction. {@link PChainOwner}
 * @property disableOwners - Optional, the disable owners to use for the transaction. {@link PChainOwner}
 * @property disableAuth - Optional, the disable auth to use for the transaction. `number[]`
 * @property context - Optional, the context to use for the transaction. {@link ContextType.Context}
 */
export type SignXPTransactionParameters = {
  account?: AvalancheAccount | Address | undefined;
  tx?: string | UnsignedTx;
  signedTxHex?: string;
  chainAlias: "X" | "P" | "C";
  utxoIds?: string[] | undefined;
  subnetAuth?: number[] | undefined;
  subnetOwners?: PChainOwner | undefined;
  disableOwners?: PChainOwner | undefined;
  disableAuth?: number[] | undefined;
  context?: ContextType.Context | undefined;
};

/**
 * The signatures for the transaction
 * @property signature - The signature of the transaction with the current account `string`
 * @property sigIndices - The indices of the signatures. Contains [inputIndex, signatureIndex] pair. `number[]`
 */
export type Signatures = {
  signature: string;
  sigIndices: number[];
};

/**
 * The return type for the signXPTransaction method
 * @property signedTxHex - The signed transaction in hex format. `string`
 * @property signatures - The signatures array for the transaction. {@link Signatures}
 * @property chainAlias - Optional, the chain to sign the transaction on. `"X" | "P" | "C"`
 * @property subnetAuth - Optional, the subnet auth to use for the transaction. `number[]`
 * @property subnetOwners - Optional, the subnet owners to use for the transaction. {@link PChainOwner}
 * @property disableOwners - Optional, the disable owners to use for the transaction. {@link PChainOwner}
 * @property disableAuth - Optional, the disable auth to use for the transaction. `number[]`
 */
export type SignXPTransactionReturnType = {
  signedTxHex: string;
  signatures: Signatures[];
  chainAlias: "X" | "P" | "C";
  subnetAuth?: number[] | undefined;
  subnetOwners?: PChainOwner | undefined;
  disableOwners?: PChainOwner | undefined;
  disableAuth?: number[] | undefined;
};

export type SignXPTransactionErrorType = RequestErrorType;

export type SignXPTransactionMethod = {
  Method: "avalanche_signTransaction";
  Parameters: Omit<SignXPTransactionParameters, "account">;
  ReturnType: SignXPTransactionReturnType;
};
