import { UnsignedTx } from "@avalabs/avalanchejs";
import { Address } from "viem";
import { RequestErrorType } from "viem/utils";
import { AvalancheAccount } from "../../../accounts/avalancheAccount.js";

export type SendXPTransactionParameters = {
  account?: AvalancheAccount | Address | undefined;
  txOrTxHex: string | UnsignedTx;
  chainAlias: "X" | "P" | "C";
  externalIndices?: number[] | undefined;
  internalIndices?: number[] | undefined;
  utxos?: string[] | undefined;
  feeTolerance?: number | undefined;
};

export type SendXPTransactionReturnType = {
  txHash: string;
};

export type SendXPTransactionErrorType = RequestErrorType;

export type SendXPTransactionMethod = {
  Method: "avalanche_sendTransaction";
  Parameters: Omit<SendXPTransactionParameters, "account">;
  ReturnType: SendXPTransactionReturnType;
};
