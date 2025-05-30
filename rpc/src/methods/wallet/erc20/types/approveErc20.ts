import { Abi, Address } from "viem";
import { RequestErrorType } from "viem/utils";
import { AvalancheAccount } from "../../../../accounts/avalancheAccount";

export type ApproveErc20Parameters = {
  account?: AvalancheAccount | Address | undefined;
  contractAddress: Address;
  spender: Address;
  amount: bigint;
  abi?: Abi | undefined;
};

export type ApproveErc20ReturnType = {
  status: "success" | "reverted";
  txHash: string;
};

export type ApproveErc20ErrorType = RequestErrorType;
