import { Abi, Address } from "viem";
import { RequestErrorType } from "viem/utils";
import { AvalancheAccount } from "../../../../accounts/avalancheAccount";

export type TokenRemoteRegisterWithHomeParameters = {
  account?: AvalancheAccount | Address | undefined;
  tokenRemoteContractAddress: Address;
  homeContractAddress: Address;
  feeTokenAddress: Address;
  feeAmount: bigint;
  gasLimit: bigint;
  abi?: Abi | undefined;
};

export type TokenRemoteRegisterWithHomeReturnType = {
  status: "success" | "reverted";
  txHash: string;
};

export type TokenRemoteRegisterWithHomeErrorType = RequestErrorType;
