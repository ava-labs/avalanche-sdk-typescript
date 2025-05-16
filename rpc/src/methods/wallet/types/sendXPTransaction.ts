import { AvalancheAccount } from "@/account/avalancheAccount";
import { Address, Hex } from "viem";
import { RequestErrorType } from "viem/utils";

export type SendXPTransactionParameters = {
  account?: AvalancheAccount | Address | undefined;
  txHex: Hex;
  chainAlias: "X" | "P" | "C";
  externalIndices?: number[] | undefined;
  internalIndices?: number[] | undefined;
  utxos?: string[] | undefined;
  feeTolerance?: number | undefined;
};

export type SendXPTransactionReturnType = {
  txHash: Hex;
};

export type SendXPTransactionErrorType = RequestErrorType;

export type SendXPTransactionMethod = {
  Method: "avalanche_sendTransaction";
  Parameters: Omit<SendXPTransactionParameters, "account">;
  ReturnType: SendXPTransactionReturnType;
};
