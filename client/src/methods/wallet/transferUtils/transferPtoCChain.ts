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
  getBech32AddressFromAccountOrClient,
  weiToNanoAvax,
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
  const [pChainExportTxnRequest, pChainFeeState, baseFee, balanceInNanoAvax] =
    await Promise.all([
      await prepareExportTxnPChain(client, {
        exportedOutputs: [
          {
            addresses: [currentAccountCChainBech32Address],
            amount: weiToNanoAvax(params.amount),
          },
        ],
        destinationChain: "C",
        context,
      }),
      getFeeState(client.pChainClient),
      getBaseFee(client),
      (
        await getBalance(client.pChainClient, {
          addresses: [currentAccountPChainBech32Address],
        })
      ).balance,
    ]);

  // Check if user has enough balance
  if (balanceInNanoAvax < weiToNanoAvax(params.amount)) {
    throw new Error(
      `Insufficient balance: ${weiToNanoAvax(
        params.amount
      )} nAVAX is required, but only ${balanceInNanoAvax} nAVAX is available`
    );
  }

  // Calculate the fee for the P chain import txn
  const pChainExportTxnFeeInNanoAvax = pvm.calculateFee(
    pChainExportTxnRequest.tx.getTx(),
    context.platformFeeConfig.weights,
    pChainFeeState.price
  );

  if (pChainExportTxnFeeInNanoAvax > weiToNanoAvax(params.amount)) {
    throw new Error(
      `Transfer amount is too low: ${pChainExportTxnFeeInNanoAvax} nAVAX Fee is required for P chain export txn, but only ${weiToNanoAvax(
        params.amount
      )} nAVAX is being transferred, try sending a higher amount`
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
  const cChainImportTxnFeeInNanoAvax =
    BigInt(baseFee) * BigInt(utils.costCorethTx(cChainImportTxnRequest.tx));

  // Calculate the total fee
  const totalFeeInNanoAvax =
    pChainExportTxnFeeInNanoAvax + cChainImportTxnFeeInNanoAvax;
  if (totalFeeInNanoAvax > weiToNanoAvax(params.amount)) {
    throw new Error(
      `Transfer amount is too low: ${cChainImportTxnFeeInNanoAvax} nAVAX Fee is required for C chain import txn,
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
