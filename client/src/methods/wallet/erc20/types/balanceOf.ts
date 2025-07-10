import { Abi, Address } from "viem";
import { RequestErrorType } from "viem/utils";

export type BalanceOfParameters = {
  contractAddress: Address;
  address: Address;
  abi?: Abi | undefined;
};

export type BalanceOfReturnType = bigint;

export type BalanceOfErrorType = RequestErrorType;
