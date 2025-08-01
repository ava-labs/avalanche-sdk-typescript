import { pvm, utils } from "@avalabs/avalanchejs";
import { isAddress } from "viem";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { getBalance } from "../../pChain/getBalance.js";
import { getFeeState } from "../../pChain/getFeeState.js";
import { baseFee as getBaseFee } from "../../public/baseFee.js";
import { prepareImportTxn as prepareImportTxnCChain } from "../cChain/prepareImportTxn.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { prepareExportTxn as prepareExportTxnPChain } from "../pChain/prepareExportTxn.js";
import { sendXPTransaction } from "../sendXPTransaction.js";
import { SendParameters, SendReturnType } from "../types/send.js";
import {
  avaxToNanoAvax,
  getBech32AddressFromAccountOrClient,
  nanoAvaxToAvax,
} from "../utils.js";
import { waitForTxn } from "../waitForTxn.js";

export type TransferPtoCChainParameters = SendParameters;

export type TransferPtoCChainReturnType = SendReturnType;

export async function transferPtoCChain(
  client: AvalancheWalletCoreClient,
  params: TransferPtoCChainParameters
): Promise<TransferPtoCChainReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const isTestnet = context.networkID === 5;

  // Get the P chain address
  let currentAccountPChainAddress = params.from;
  if (!currentAccountPChainAddress) {
    currentAccountPChainAddress = await getBech32AddressFromAccountOrClient(
      client,
      params.account,
      "P",
      isTestnet ? "fuji" : "avax"
    );
  }

  if (!isAddress(params.to)) {
    throw new Error("Invalid `to` address");
  }

  // Prepare the P chain export txn and C chain import txn and get the fee for each
  const [
    pChainExportTxnRequest,
    cChainImportTxnRequest,
    pChainFeeState,
    baseFee,
    balance,
  ] = await Promise.all([
    await prepareExportTxnPChain(client, {
      exportedOutputs: [
        { addresses: [currentAccountPChainAddress], amount: params.amount },
      ],
      destinationChain: "C",
      context,
    }),
    prepareImportTxnCChain(client, {
      fromAddresses: [currentAccountPChainAddress],
      sourceChain: "P",
      toAddress: params.to,
      context,
    }),
    getFeeState(client.pChainClient),
    getBaseFee(client),
    nanoAvaxToAvax(
      (
        await getBalance(client.pChainClient, {
          addresses: [currentAccountPChainAddress],
        })
      ).balance
    ),
  ]);

  // Calculate the fee for the P chain import txn
  const pChainExportTxnFee = pvm.calculateFee(
    pChainExportTxnRequest.tx.getTx(),
    context.platformFeeConfig.weights,
    pChainFeeState.price
  );
  const cChainImportTxnFee =
    BigInt(baseFee) * BigInt(utils.costCorethTx(cChainImportTxnRequest.tx));

  // Check if user has enough balance
  if (Number(balance) < params.amount) {
    throw new Error(
      `Insufficient balance: ${params.amount} AVAX is required, but only ${balance} AVAX is available`
    );
  }

  // Calculate the total fee
  const totalFee = pChainExportTxnFee + cChainImportTxnFee;
  if (totalFee > avaxToNanoAvax(params.amount)) {
    throw new Error(
      `Transfer amount is too low: ${nanoAvaxToAvax(
        totalFee
      )} AVAX Fee is required, but only ${
        params.amount
      } AVAX is being transferred`
    );
  }

  // Send the P chain export txn
  const sendPChainExportTxn = await sendXPTransaction(
    client,
    pChainExportTxnRequest
  );
  await waitForTxn(client, sendPChainExportTxn);

  // Send the C chain import txn
  const sendCChainImportTxn = await sendXPTransaction(
    client,
    cChainImportTxnRequest
  );
  await waitForTxn(client, sendCChainImportTxn);

  return {
    txHashes: [
      {
        txHash: sendPChainExportTxn.txHash,
        chainAlias: "P",
      },
      {
        txHash: sendCChainImportTxn.txHash,
        chainAlias: "C",
      },
    ],
  };
}
