import { RequestErrorType } from "viem/utils";

export type GetAllBalancesParameters = {
  address: string;
};

export type GetAllBalancesReturnType = {
  balances: { asset: string; balance: bigint }[];
};

export type GetAllBalancesErrorType =  RequestErrorType;

export type GetAllBalancesMethod = {
  Method: "avm.getAllBalances";
  Parameters: GetAllBalancesParameters;
  ReturnType: GetAllBalancesReturnType;
};