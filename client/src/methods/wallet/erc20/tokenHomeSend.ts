import { waitForTransactionReceipt, writeContract } from "viem/actions";
import { parseAvalancheAccount } from "../../../accounts/utils/parseAvalancheAccount";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient";
import { tokenHomeABI } from "../abis/tokenHome";
import {
  TokenHomeSendParameters,
  TokenHomeSendReturnType,
} from "./types/tokenHomeSend";

export async function tokenHomeSend(
  client: AvalancheWalletCoreClient,
  params: TokenHomeSendParameters
): Promise<TokenHomeSendReturnType> {
  const {
    tokenHomeAddr,
    destinationBlockchainID,
    tokenRemoteAddr,
    recipientAddr,
    erc20TokenAddr,
    primaryFee = 0n,
    secondaryFee = 0n,
    requiredGasLimit = 250000n,
    multiHopFallback = "0x0000000000000000000000000000000000000000",
    amount,
    abi,
    account,
  } = params;

  const acc = parseAvalancheAccount(account);
  if (!acc && !client.account) {
    throw new Error("no account found");
  }

  const txHash = await writeContract(client, {
    account: acc?.evmAccount,
    abi: abi ?? tokenHomeABI,
    functionName: "send",
    address: tokenHomeAddr,
    args: [
      {
        destinationBlockchainID,
        destinationTokenTransferrerAddress: tokenRemoteAddr,
        recipient: recipientAddr,
        primaryFeeTokenAddress: erc20TokenAddr,
        primaryFee: primaryFee,
        secondaryFee: secondaryFee,
        requiredGasLimit: requiredGasLimit,
        multiHopFallback: multiHopFallback,
      },
      amount,
    ],
    gasLimit: 5000000n,
  } as any);

  const tx = await waitForTransactionReceipt(client, { hash: txHash });

  return {
    status: tx.status,
    txHash,
  };
}
