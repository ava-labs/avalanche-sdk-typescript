import { Abi, Address } from "viem";
import { RequestErrorType } from "viem/utils";

export type GetErc20NameParameters = {
  contractAddress: Address;
  abi?: Abi | undefined;
};

export type GetErc20NameReturnType = string;

export type GetErc20NameErrorType = RequestErrorType;
