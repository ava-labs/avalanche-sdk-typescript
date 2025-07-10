import { Abi, Address } from "viem";
import { RequestErrorType } from "viem/utils";
import { AvalancheAccount } from "../../../../accounts/avalancheAccount";

export type DeployTokenRemoteParameters = {
  account?: AvalancheAccount | Address | undefined;
  minTeleporterVersion: number;
  remoteTeleporterRegistryAddr: Address;
  remoteTeleporterManagerAddr: Address;
  tokenHomeBlockchainId: string;
  tokenHomeContractAddr: Address;
  decimals: number;
  remoteTokenName: string;
  remoteTokenSymbol: string;
  abi?: Abi | undefined;
  bytecode?: string | undefined;
};

export type DeployTokenRemoteReturnType = {
  status: "success" | "reverted";
  contractAddress: Address | null | undefined;
};

export type DeployTokenRemoteErrorType = RequestErrorType;
