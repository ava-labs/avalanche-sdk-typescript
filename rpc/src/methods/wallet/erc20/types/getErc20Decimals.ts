import { Abi, Address } from "viem";
import { RequestErrorType } from "viem/utils";

export type GetErc20DecimalsParameters = {
  contractAddress: Address;
  abi?: Abi | undefined;
};

export type GetErc20DecimalsReturnType = number;

export type GetErc20DecimalsErrorType = RequestErrorType;
