import { deployContract, waitForTransactionReceipt } from "viem/actions";
import { parseAvalancheAccount } from "../../../accounts/utils/parseAvalancheAccount";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient";
import { tokenRemoteABI, tokenRemoteBytecode } from "../abis/tokenRemote";
import {
  DeployTokenRemoteParameters,
  DeployTokenRemoteReturnType,
} from "./types/deployTokenRemote";

export async function deployTokenRemote(
  client: AvalancheWalletCoreClient,
  params: DeployTokenRemoteParameters
): Promise<DeployTokenRemoteReturnType> {
  const {
    minTeleporterVersion,
    remoteTeleporterRegistryAddr,
    remoteTeleporterManagerAddr,
    tokenHomeBlockchainId,
    tokenHomeContractAddr,
    remoteTokenName,
    remoteTokenSymbol,
    decimals,
    abi,
    bytecode,
    account,
  } = params;

  const acc = parseAvalancheAccount(account);
  if (!acc && !client.account) {
    throw new Error("no account found");
  }

  const registryAddr =
    remoteTeleporterRegistryAddr ??
    (client.chain?.contracts as any)?.teleporterRegistry?.address;

  const managerAddr = remoteTeleporterManagerAddr;

  if (!registryAddr || !managerAddr) {
    throw new Error(
      "teleporterRegistryAddr or teleporterManagerAddr not found"
    );
  }

  if (!tokenHomeBlockchainId || !tokenHomeContractAddr || !decimals) {
    throw new Error(
      "tokenHomeBlockchainId or tokenHomeContractAddr or decimals not found"
    );
  }

  if (!remoteTokenName || !remoteTokenSymbol) {
    throw new Error("remoteTokenName or remoteTokenSymbol not found");
  }

  const txHash = await deployContract(client, {
    account: acc?.evmAccount,
    abi: abi ?? tokenRemoteABI,
    bytecode: bytecode ?? tokenRemoteBytecode,
    args: {
      teleporterRegistryAddress: registryAddr,
      teleporterManager: managerAddr,
      minTeleporterVersion: BigInt(minTeleporterVersion),
      tokenHomeBlockchainID: tokenHomeBlockchainId,
      tokenHomeAddress: tokenHomeContractAddr,
      tokenHomeDecimals: Number(decimals),
    },
    remoteTokenName,
    remoteTokenSymbol,
    decimals,
  } as any);

  const txRes = await waitForTransactionReceipt(client, { hash: txHash });

  return {
    status: txRes.status,
    contractAddress: txRes.contractAddress,
  };
}
