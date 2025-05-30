import { Abi, Address } from "viem";
import { RequestErrorType } from "viem/utils";

export type TransferErc20Parameters = {
  contractAddress: Address;
  recipient: Address;
  amount: bigint;
  abi?: Abi | undefined;
};

export type TransferErc20ReturnType = {
  status: "success" | "reverted";
  txHash: string;
};

export type TransferErc20ErrorType = RequestErrorType;
