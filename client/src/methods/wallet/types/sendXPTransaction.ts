import { PChainOwner, UnsignedTx } from "@avalabs/avalanchejs";
import { Address } from "viem";
import { RequestErrorType } from "viem/utils";
import { AvalancheAccount } from "../../../accounts/avalancheAccount.js";

/**
 * The parameters for the sendXPTransaction method
 * @property tx - The transaction to send, either a hex string or an UnsignedTx object. {@link string} or {@link UnsignedTx}
 * @property chainAlias - The chain to send the transaction to. {@link "X"} or {@link "P"} or {@link "C"}
 * @property account - Optional, the account to use for the transaction. {@link AvalancheAccount} or {@link Address}
 * @property accountIndex - Optional, the account index to use for the transaction from custom transport (eg: core extension). {@link number}
 * @property externalIndices - Optional, the external indices to use for the transaction. {@link number[]}
 * @property internalIndices - Optional, the internal indices to use for the transaction. {@link number[]}
 * @property utxoIds - Optional, the utxo ids to use for the transaction. {@link string[]}
 * @property feeTolerance - Optional, the fee tolerance to use for the transaction. {@link number}
 * @property subnetAuth - Optional, the subnet auth to use for the transaction. {@link number[]}
 */
export type SendXPTransactionParameters = {
  account?: AvalancheAccount | Address | undefined;
  tx: string | UnsignedTx;
  chainAlias: "X" | "P" | "C";
  externalIndices?: number[] | undefined;
  internalIndices?: number[] | undefined;
  utxoIds?: string[] | undefined;
  feeTolerance?: number | undefined;
  subnetAuth?: number[] | undefined;
  subnetOwners?: PChainOwner | undefined;
  disableOwners?: PChainOwner | undefined;
  disableAuth?: number[] | undefined;
};

/**
 * The return type for the sendXPTransaction method
 * @property txHash - The hash of the transaction {@link string}
 */
export type SendXPTransactionReturnType = {
  txHash: string;
};

export type SendXPTransactionErrorType = RequestErrorType;

export type SendXPTransactionMethod = {
  Method: "avalanche_sendTransaction";
  Parameters: Omit<SendXPTransactionParameters, "account">;
  ReturnType: SendXPTransactionReturnType;
};
