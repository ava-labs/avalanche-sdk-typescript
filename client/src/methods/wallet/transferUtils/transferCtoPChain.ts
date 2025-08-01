import { evm, pvm, utils } from "@avalabs/avalanchejs";
import { formatEther } from "viem";
import { getBalance, getTransactionCount } from "viem/actions";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { getFeeState } from "../../pChain/getFeeState.js";
import { baseFee as getBaseFee } from "../../public/baseFee.js";
import { prepareExportTxn as prepareExportTxnCChain } from "../cChain/prepareExportTxn.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { prepareImportTxn as prepareImportTxnPChain } from "../pChain/prepareImportTxn.js";
import { sendXPTransaction } from "../sendXPTransaction.js";
import { SendParameters, SendReturnType } from "../types/send.js";
import {
  avaxToNanoAvax,
  bech32AddressToBytes,
  getBech32AddressFromAccountOrClient,
  getChainIdFromAlias,
  getEVMAddressFromAccountOrClient,
  nanoAvaxToAvax,
} from "../utils.js";
import { waitForTxn } from "../waitForTxn.js";

export type TransferCtoPChainParameters = SendParameters;

export type TransferCtoPChainReturnType = SendReturnType;
export async function transferCtoPChain(
  client: AvalancheWalletCoreClient,
  params: TransferCtoPChainParameters
): Promise<TransferCtoPChainReturnType> {
  const context = params.context || (await getContextFromURI(client));

  // Get current account evm address
  const currentAccountEVMAddress =
    params.from ||
    (await getEVMAddressFromAccountOrClient(client, params.account));

  // Get the current account P chain address
  const currentAccountPChainAddress = await getBech32AddressFromAccountOrClient(
    client,
    params.account,
    "P",
    context.networkID === 5 ? "fuji" : "avax"
  );

  // Validate the P chain address
  if (!params.to.startsWith("P-")) {
    throw new Error("Invalid P chain address, it should start with P-");
  }

  // Prepare the C chain export txn and P chain import txn and get the fee for each
  const [
    cChainExportTxnRequest,
    pChainImportTxnRequest,
    pChainFeeState,
    baseFee,
    txCount,
    balance,
  ] = await Promise.all([
    prepareExportTxnCChain(client, {
      destinationChain: "P",
      fromAddress: currentAccountEVMAddress,
      exportedOutput: {
        addresses: [currentAccountPChainAddress],
        amount: params.amount,
      },
      context,
    }),
    prepareImportTxnPChain(client, {
      sourceChain: "C",
      importedOutput: {
        addresses: [params.to],
      },
      context,
    }),
    getFeeState(client.pChainClient),
    getBaseFee(client),
    getTransactionCount(client, {
      address: `0x${utils.strip0x(currentAccountEVMAddress)}`,
    }),
    formatEther(
      await getBalance(client, {
        address: `0x${utils.strip0x(currentAccountEVMAddress)}`,
      })
    ),
  ]);

  // Calculate the fee for the P chain import txn
  const pChainImportTxnFee = pvm.calculateFee(
    pChainImportTxnRequest.tx.getTx(),
    context.platformFeeConfig.weights,
    pChainFeeState.price
  );

  const cChainExportTxnFee = evm.estimateExportCost(
    context,
    BigInt(baseFee),
    avaxToNanoAvax(params.amount),
    getChainIdFromAlias("P", context.networkID),
    utils.hexToBuffer(currentAccountEVMAddress),
    [bech32AddressToBytes(params.to)],
    BigInt(txCount)
  );

  // Check if user has enough balance
  if (Number(balance) < params.amount) {
    throw new Error(
      `Insufficient balance: ${params.amount} AVAX is required, but only ${balance} AVAX is available`
    );
  }

  // Calculate the total fee
  const totalFee = pChainImportTxnFee + cChainExportTxnFee;
  if (totalFee > avaxToNanoAvax(params.amount)) {
    throw new Error(
      `Transfer amount is too low: ${nanoAvaxToAvax(
        totalFee
      )} AVAX Fee is required, but only ${
        params.amount
      } AVAX is being transferred`
    );
  }

  // Sign and send the C chain export txn and wait for it.
  const sendCChainExportTxn = await sendXPTransaction(
    client,
    cChainExportTxnRequest
  );
  await waitForTxn(client, sendCChainExportTxn);

  // Sign and send the P chain import txn and wait for it.
  const sendPChainImportTxn = await sendXPTransaction(
    client,
    pChainImportTxnRequest
  );
  await waitForTxn(client, sendPChainImportTxn);

  return {
    txHashes: [
      {
        txHash: sendCChainExportTxn.txHash,
        chainAlias: "C",
      },
      {
        txHash: sendPChainImportTxn.txHash,
        chainAlias: "P",
      },
    ],
  };
}
