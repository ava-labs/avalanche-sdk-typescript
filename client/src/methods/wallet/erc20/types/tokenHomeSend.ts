import { Abi, Address } from "viem";
import { RequestErrorType } from "viem/utils";
import { AvalancheAccount } from "../../../../accounts/avalancheAccount";

export type TokenHomeSendParameters = {
  account?: AvalancheAccount | Address | undefined;
  destinationBlockchainID: string;
  tokenHomeAddr: Address;
  tokenRemoteAddr: Address;
  recipientAddr: Address;
  erc20TokenAddr: Address;
  primaryFee?: bigint;
  secondaryFee?: bigint;
  requiredGasLimit?: bigint;
  multiHopFallback?: Address;
  amount: bigint;
  abi?: Abi | undefined;
};

export type TokenHomeSendReturnType = {
  status: "success" | "reverted";
  txHash: string;
};

export type TokenHomeSendErrorType = RequestErrorType;
