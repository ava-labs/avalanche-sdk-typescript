import { Abi, Address } from "viem";
import { RequestErrorType } from "viem/utils";

export type GetErc20SymbolParameters = {
  contractAddress: Address;
  abi?: Abi | undefined;
};

export type GetErc20SymbolReturnType = string;

export type GetErc20SymbolErrorType = RequestErrorType;
