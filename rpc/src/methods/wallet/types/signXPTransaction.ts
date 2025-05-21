import { UnsignedTx } from "@avalabs/avalanchejs";
import { Address } from "viem";
import { RequestErrorType } from "viem/utils";
import { AvalancheAccount } from "../../../accounts/avalancheAccount.js";

export type SignXPTransactionParameters = {
  account?: AvalancheAccount | Address | undefined;
  txOrTxHex: string | UnsignedTx;
  chainAlias: "X" | "P";
  utxos?: string[] | undefined;
};

export type Signatures = {
  signature: string;
  sigIndices: number[];
};

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
