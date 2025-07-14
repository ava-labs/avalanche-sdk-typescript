import { Abi, Address } from "viem";
import { RequestErrorType } from "viem/utils";
import { AvalancheAccount } from "../../../../accounts/avalancheAccount";

export type DeployErc20Parameters = {
  account?: AvalancheAccount | Address | undefined;
  name: string;
  symbol: string;
  totalSupply: number | bigint;
  abi?: Abi | undefined;
  bytecode?: string | undefined;
};

export type DeployErc20ReturnType = {
  status: "success" | "reverted";
  contractAddress: Address | null | undefined;
};

export type DeployErc20ErrorType = RequestErrorType;
