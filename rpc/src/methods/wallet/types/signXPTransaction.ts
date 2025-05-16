import { AvalancheAccount } from "@/account/avalancheAccount";
import { Address, Hex } from "viem";
import { RequestErrorType } from "viem/utils";

export type SignXPTransactionParameters = {
  account?: AvalancheAccount | Address | undefined;
  txHex: Hex;
  chainAlias: "X" | "P";
  utxos?: string[] | undefined;
};

export type Signatures = {
  signature: string;
  sigIndices: number[];
};

export type SignXPTransactionReturnType = {
  signedTxHex: Hex;
  signatures: Signatures[];
};

export type SignXPTransactionErrorType = RequestErrorType;

export type SignXPTransactionMethod = {
  Method: "avalanche_signTransaction";
  Parameters: Omit<SignXPTransactionParameters, "account">;
  ReturnType: SignXPTransactionReturnType;
};
