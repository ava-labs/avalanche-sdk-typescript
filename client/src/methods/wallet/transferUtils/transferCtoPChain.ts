import { evm, pvm, utils } from "@avalabs/avalanchejs";
import { formatEther } from "viem";
import { getBalance, getTransactionCount } from "viem/actions";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { P_CHAIN_ALIAS } from "../../consts.js";
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
  const currentAccountPChainBech32Address =
    await getBech32AddressFromAccountOrClient(
      client,
      params.account,
      P_CHAIN_ALIAS,
      context.networkID === 5 ? "fuji" : "avax"
    );

  // Validate the P chain address
  if (!params.to.startsWith("P-")) {
    throw new Error("Invalid P chain address, it should start with P-");
  }

  // Prepare the C chain export txn and get the fee for each
  const [cChainExportTxnRequest, pChainFeeState, baseFee, txCount, balance] =
    await Promise.all([
      prepareExportTxnCChain(client, {
        destinationChain: "P",
        fromAddress: currentAccountEVMAddress,
        exportedOutput: {
          addresses: [currentAccountPChainBech32Address],
          amount: params.amount,
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

  // Check if user has enough balance
  if (Number(balance) < params.amount) {
    throw new Error(
      `Insufficient balance: ${params.amount} AVAX is required, but only ${balance} AVAX is available`
    );
  }

  // Calculate the fee for the C chain export txn
  const cChainExportTxnFee = evm.estimateExportCost(
    context,
    BigInt(baseFee),
    avaxToNanoAvax(params.amount),
    getChainIdFromAlias("P", context.networkID),
    utils.hexToBuffer(currentAccountEVMAddress),
    [bech32AddressToBytes(params.to)],
    BigInt(txCount)
  );

  // Check if the fee for the C chain export txn is too high
  if (cChainExportTxnFee > avaxToNanoAvax(params.amount)) {
    throw new Error(
      `Transfer amount is too low: ${nanoAvaxToAvax(
        cChainExportTxnFee
      )} AVAX Fee is required for C chain export txn, but only ${
        params.amount
      } AVAX is being transferred, try sending a higher amount.`
    );
  }

  // Sign and send the C chain export txn and wait for it.
  const sendCChainExportTxn = await sendXPTransaction(
    client,
    cChainExportTxnRequest
  );
  await waitForTxn(client, sendCChainExportTxn);

  // Prepare the P chain import txn
  const pChainImportTxnRequest = await prepareImportTxnPChain(client, {
    sourceChain: "C",
    importedOutput: {
      addresses: [params.to],
    },
    context,
  });

  // Calculate the fee for the P chain import txn
  const pChainImportTxnFee = pvm.calculateFee(
    pChainImportTxnRequest.tx.getTx(),
    context.platformFeeConfig.weights,
    pChainFeeState.price
  );

  // Calculate the total fee
  const totalFee = pChainImportTxnFee + cChainExportTxnFee;
  if (totalFee > avaxToNanoAvax(params.amount)) {
    throw new Error(
      `Transfer amount is too low: ${nanoAvaxToAvax(
        pChainImportTxnFee
      )} AVAX Fee is required for P chain import txn, 
      try sending a higher amount.
      C chain export txn hash: ${sendCChainExportTxn.txHash}`
    );
  }

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
