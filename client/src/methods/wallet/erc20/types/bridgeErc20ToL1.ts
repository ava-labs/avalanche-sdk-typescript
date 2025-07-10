import { Address, Chain } from "viem";
import { RequestErrorType } from "viem/utils";
import { AvalancheAccount } from "../../../../accounts/avalancheAccount";

export type BridgeErc20ToL1Parameters = {
  account?: AvalancheAccount | Address | undefined;
  destinationChain: Chain;
  erc20TokenAddr: Address;
  amount: bigint;
  recipient: Address;
  destinationBlockchainID?: string | undefined;
  homeBlockchainID?: string | undefined;
  tokenRemoteAddr?: Address | undefined;
  tokenHomeAddr?: Address | undefined;
  gasLimit?: bigint | undefined;
  feeReceiver?: Address | undefined;
};

export type BridgeErc20ToL1ReturnType = {
  status: "success" | "reverted";
  transferSendTransactionHash: string;
  tokenHomeAddr: Address;
  tokenRemoteAddr: Address;
  transferApproveTxHash: string;
};

export type BridgeErc20ToL1ErrorType = RequestErrorType;
