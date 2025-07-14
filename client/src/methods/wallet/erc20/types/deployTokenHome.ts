import { Abi, Address } from "viem";
import { RequestErrorType } from "viem/utils";
import { AvalancheAccount } from "../../../../accounts/avalancheAccount";

export type DeployTokenHomeParameters = {
  account?: AvalancheAccount | Address | undefined;
  minTeleporterVersion: number;
  erc20ContractAddr: Address;
  teleporterRegistryAddr?: Address | undefined;
  teleporterManagerAddr: Address;
  decimals: number;
  abi?: Abi | undefined;
  bytecode?: string | undefined;
};

export type DeployTokenHomeReturnType = {
  status: "success" | "reverted";
  contractAddress: Address | null | undefined;
};

export type DeployTokenHomeErrorType = RequestErrorType;
