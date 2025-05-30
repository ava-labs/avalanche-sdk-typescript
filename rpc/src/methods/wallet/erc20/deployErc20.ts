import { Account } from "viem";
import { deployContract, waitForTransactionReceipt } from "viem/actions";
import { parseAvalancheAccount } from "../../../accounts/utils/parseAvalancheAccount";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient";
import { erc20ABI, erc20Bytecode } from "../abis/erc20";
import {
  DeployErc20Parameters,
  DeployErc20ReturnType,
} from "./types/deployErc20";

export async function deployErc20(
  client: AvalancheWalletCoreClient,
  params: DeployErc20Parameters
): Promise<DeployErc20ReturnType> {
  const { account, name, symbol, totalSupply, abi, bytecode } = params;
  const tokenTotalSupply = BigInt(totalSupply) * 10n ** BigInt(18);
  const acc = parseAvalancheAccount(account);
  if (!acc && !client.account) {
    throw new Error("no account found");
  }
  const accAddr =
    acc?.evmAccount.address ?? (client.account as never as Account).address;

  const txHash = await deployContract(client, {
    abi: abi ?? erc20ABI,
    bytecode: bytecode ?? erc20Bytecode,
    args: [name, symbol, tokenTotalSupply, accAddr],
  } as any);

  const txRes = await waitForTransactionReceipt(client, { hash: txHash });

  return {
    status: txRes.status,
    contractAddress: txRes.contractAddress,
  };
}
