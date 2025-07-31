import { Address, formatEther, parseEther } from "viem";
import {
  estimateGas,
  getBalance,
  getGasPrice,
  prepareTransactionRequest,
  sendRawTransaction,
  sendTransaction,
  signTransaction,
  waitForTransactionReceipt,
} from "viem/actions";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { SendParameters, SendReturnType } from "../types/send.js";
import { getEVMAddressFromAccountOrClient } from "../utils.js";

export type TransferCtoCChainReturnType = SendReturnType;

export type TransferCtoCChainParameters = SendParameters;

export async function transferCtoCChain(
  client: AvalancheWalletCoreClient,
  params: TransferCtoCChainParameters
): Promise<TransferCtoCChainReturnType> {
  const isAccountProvided = !!params.account || !!client.account;
  console.log("isAccountProvided", isAccountProvided);
  // Get the current account C chain address
  const currentAccountEVMAddress =
    params.from ||
    (await getEVMAddressFromAccountOrClient(client, params.account));

  const [estimateGasResponse, gasPrice, balance] = await Promise.all([
    formatEther(
      await estimateGas(client, {
        to: params.to as Address,
        value: parseEther(params.amount.toString()),
        account: currentAccountEVMAddress as Address,
      } as any)
    ),
    formatEther(await getGasPrice(client)),
    formatEther(
      await getBalance(client, {
        address: currentAccountEVMAddress as Address,
      })
    ),
  ]);

  const estimatedFee = Number(estimateGasResponse) * Number(gasPrice);

  if (
    Number(balance) < Number(estimatedFee) ||
    Number(balance) < Number(params.amount)
  ) {
    throw new Error(
      `Insufficient balance: ${estimatedFee} AVAX is required, but only ${balance} AVAX is available`
    );
  }

  // If the account is not provided, we can use the sendTransaction action to send the
  // transaction (this expects a injected wallet to sign the transaction)
  // Otherwise, we need to prepare the transaction request, sign it, and send it using
  // sendRawTransaction
  let txnHash;
  if (!isAccountProvided) {
    txnHash = await sendTransaction(client, {
      to: params.to as Address,
      value: parseEther(params.amount.toString()),
      account: currentAccountEVMAddress as Address,
    } as any);
  } else {
    const request = await prepareTransactionRequest(client, {
      to: params.to as Address,
      value: parseEther(params.amount.toString()),
      account: currentAccountEVMAddress as Address,
    } as any);

    const account = params.account?.evmAccount || client.account;

    const serializedTransaction = await signTransaction(client, {
      ...request,
      account,
    } as any);
    txnHash = await sendRawTransaction(client, { serializedTransaction });
  }

  await waitForTransactionReceipt(client, { hash: txnHash });

  return {
    txHashes: [
      {
        txHash: txnHash,
        chainAlias: "C",
      },
    ],
  };
}
