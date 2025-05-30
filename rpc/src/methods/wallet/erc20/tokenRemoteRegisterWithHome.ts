import { waitForTransactionReceipt, writeContract } from "viem/actions";
import { parseAvalancheAccount } from "../../../accounts/utils/parseAvalancheAccount";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient";
import { tokenRemoteABI } from "../abis/tokenRemote";
import {
  TokenRemoteRegisterWithHomeParameters,
  TokenRemoteRegisterWithHomeReturnType,
} from "./types/tokenRemoteRegisterWithHome";

export async function tokenRemoteRegisterWithHome(
  client: AvalancheWalletCoreClient,
  params: TokenRemoteRegisterWithHomeParameters
): Promise<TokenRemoteRegisterWithHomeReturnType> {
  const {
    tokenRemoteContractAddress,
    abi,
    feeTokenAddress = "0x0000000000000000000000000000000000000000",
    feeAmount = 0n,
    gasLimit = 250000n,
    account,
  } = params;

  const acc = parseAvalancheAccount(account);
  if (!acc && !client.account) {
    throw new Error("no account found");
  }

  const feeInfo = [feeTokenAddress, feeAmount];

  const txHash = await writeContract(client, {
    account: acc?.evmAccount,
    abi: abi ?? tokenRemoteABI,
    functionName: "registerWithHome",
    args: [feeInfo],
    gasLimit,
    address: tokenRemoteContractAddress,
  } as any);

  const tx = await waitForTransactionReceipt(client, { hash: txHash });

  return {
    status: tx.status,
    txHash,
  };
}
