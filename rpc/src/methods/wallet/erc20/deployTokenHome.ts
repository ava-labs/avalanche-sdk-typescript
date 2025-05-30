import { deployContract, waitForTransactionReceipt } from "viem/actions";
import { parseAvalancheAccount } from "../../../accounts/utils/parseAvalancheAccount";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient";
import { tokenHomeABI, tokenHomeBytecode } from "../abis/tokenHome";
import {
  DeployTokenHomeParameters,
  DeployTokenHomeReturnType,
} from "./types/deployTokenHome";

export async function deployTokenHome(
  client: AvalancheWalletCoreClient,
  params: DeployTokenHomeParameters
): Promise<DeployTokenHomeReturnType> {
  const {
    account,
    minTeleporterVersion,
    erc20ContractAddr,
    teleporterRegistryAddr,
    teleporterManagerAddr,
    decimals,
    abi,
    bytecode,
  } = params;

  const acc = parseAvalancheAccount(account);
  if (!acc && !client.account) {
    throw new Error("no account found");
  }

  const registryAddr =
    teleporterRegistryAddr ??
    (client.chain?.contracts as any)?.teleporterRegistry?.address;

  if (!registryAddr || !teleporterManagerAddr) {
    throw new Error(
      "teleporterRegistryAddr or teleporterManagerAddr not found"
    );
  }

  const txHash = await deployContract(client, {
    account: acc?.evmAccount,
    abi: abi ?? tokenHomeABI,
    bytecode: bytecode ?? tokenHomeBytecode,
    args: [
      registryAddr,
      teleporterManagerAddr,
      BigInt(minTeleporterVersion),
      erc20ContractAddr,
      decimals,
    ],
  } as any);

  const txRes = await waitForTransactionReceipt(client, { hash: txHash });

  return {
    status: txRes.status,
    contractAddress: txRes.contractAddress,
  };
}
