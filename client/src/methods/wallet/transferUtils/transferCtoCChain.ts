import { Address } from "viem";
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

  // Get the current account C chain address
  const currentAccountEVMAddress =
    params.from ||
    (await getEVMAddressFromAccountOrClient(client, params.account));

  const [estimateGasResponse, gasPrice, balanceInWei] = await Promise.all([
    await estimateGas(client, {
      to: params.to as Address,
      value: params.amount,
      account: currentAccountEVMAddress as Address,
    } as any),
    await getGasPrice(client),
    await getBalance(client, {
      address: currentAccountEVMAddress as Address,
    }),
  ]);

  const estimatedFee = estimateGasResponse * gasPrice;

  if (balanceInWei < estimatedFee || balanceInWei < params.amount) {
    throw new Error(
      `Insufficient balance: ${estimatedFee} AVAX (in wei) is required, but only ${balanceInWei} AVAX (in wei) is available`
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
      value: params.amount,
      account: currentAccountEVMAddress as Address,
    } as any);
  } else {
    const request = await prepareTransactionRequest(client, {
      to: params.to as Address,
      value: params.amount,
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
