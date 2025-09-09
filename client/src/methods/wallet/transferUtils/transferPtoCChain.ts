import { pvm, utils } from "@avalabs/avalanchejs";
import { isAddress } from "viem";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { C_CHAIN_ALIAS, P_CHAIN_ALIAS } from "../../consts.js";
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

  // Note: CChain and PChain have different bech32 addresses for seedless accounts on core
  // The value in both can be same for seed accounts
  // Get the bech32 C chain address
  let currentAccountCChainBech32Address = params.from;
  if (!currentAccountCChainBech32Address) {
    currentAccountCChainBech32Address =
      await getBech32AddressFromAccountOrClient(
        client,
        params.account,
        C_CHAIN_ALIAS,
        isTestnet ? "fuji" : "avax"
      );
  }

  // Get the bech32 P chain address
  let currentAccountPChainBech32Address = params.from;
  if (!currentAccountPChainBech32Address) {
    currentAccountPChainBech32Address =
      await getBech32AddressFromAccountOrClient(
        client,
        params.account,
        P_CHAIN_ALIAS,
        isTestnet ? "fuji" : "avax"
      );
  }

  if (!isAddress(params.to)) {
    throw new Error("Invalid `to` address");
  }

  // Prepare the P chain export txn and C chain import txn and get the fee for each
  const [pChainExportTxnRequest, pChainFeeState, baseFee, balance] =
    await Promise.all([
      await prepareExportTxnPChain(client, {
        exportedOutputs: [
          {
            addresses: [currentAccountCChainBech32Address],
            amount: params.amount,
          },
        ],
        destinationChain: "C",
        context,
      }),
      getFeeState(client.pChainClient),
      getBaseFee(client),
      nanoAvaxToAvax(
        (
          await getBalance(client.pChainClient, {
            addresses: [currentAccountPChainBech32Address],
          })
        ).balance
      ),
    ]);

  // Check if user has enough balance
  if (Number(balance) < params.amount) {
    throw new Error(
      `Insufficient balance: ${params.amount} AVAX is required, but only ${balance} AVAX is available`
    );
  }

  // Calculate the fee for the P chain import txn
  const pChainExportTxnFee = pvm.calculateFee(
    pChainExportTxnRequest.tx.getTx(),
    context.platformFeeConfig.weights,
    pChainFeeState.price
  );

  if (pChainExportTxnFee > avaxToNanoAvax(params.amount)) {
    throw new Error(
      `Transfer amount is too low: ${nanoAvaxToAvax(
        pChainExportTxnFee
      )} AVAX Fee is required for P chain export txn, but only ${
        params.amount
      } AVAX is being transferred, try sending a higher amount`
    );
  }

  // Send the P chain export txn
  const sendPChainExportTxn = await sendXPTransaction(
    client,
    pChainExportTxnRequest
  );
  await waitForTxn(client, sendPChainExportTxn);

  // Prepare the C chain import txn
  const cChainImportTxnRequest = await prepareImportTxnCChain(client, {
    fromAddresses: [currentAccountCChainBech32Address],
    sourceChain: "P",
    toAddress: params.to,
    context,
  });

  // Calculate the fee for the C chain import txn
  const cChainImportTxnFee =
    BigInt(baseFee) * BigInt(utils.costCorethTx(cChainImportTxnRequest.tx));

  // Calculate the total fee
  const totalFee = pChainExportTxnFee + cChainImportTxnFee;
  if (totalFee > avaxToNanoAvax(params.amount)) {
    throw new Error(
      `Transfer amount is too low: ${nanoAvaxToAvax(
        cChainImportTxnFee
      )} AVAX Fee is required for C chain import txn,
      try sending a higher amount.
      P chain export txn hash: ${sendPChainExportTxn.txHash}`
    );
  }

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
