import { evm, pvm, utils } from "@avalabs/avalanchejs";
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
  bech32AddressToBytes,
  getBech32AddressFromAccountOrClient,
  getChainIdFromAlias,
  getEVMAddressFromAccountOrClient,
  weiToNanoAvax,
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
  const [
    cChainExportTxnRequest,
    pChainFeeState,
    baseFee,
    txCount,
    balanceInWei,
  ] = await Promise.all([
    prepareExportTxnCChain(client, {
      destinationChain: "P",
      fromAddress: currentAccountEVMAddress,
      exportedOutput: {
        addresses: [currentAccountPChainBech32Address],
        amount: weiToNanoAvax(params.amount),
      },
      context,
    }),
    getFeeState(client.pChainClient),
    getBaseFee(client),
    getTransactionCount(client, {
      address: `0x${utils.strip0x(currentAccountEVMAddress)}`,
    }),
    await getBalance(client, {
      address: `0x${utils.strip0x(currentAccountEVMAddress)}`,
    }),
  ]);

  // Check if user has enough balance
  if (balanceInWei < params.amount) {
    throw new Error(
      `Insufficient balance: ${params.amount} ${params.token} (in wei) is required, but only ${balanceInWei} ${params.token} (in wei) is available`
    );
  }

  // Calculate the fee for the C chain export txn
  const cChainExportTxnFeeInNanoAvax = evm.estimateExportCost(
    context,
    BigInt(baseFee),
    weiToNanoAvax(params.amount),
    getChainIdFromAlias("P", context.networkID),
    utils.hexToBuffer(currentAccountEVMAddress),
    [bech32AddressToBytes(params.to)],
    BigInt(txCount)
  );

  // Check if the fee for the C chain export txn is too high
  if (cChainExportTxnFeeInNanoAvax > weiToNanoAvax(params.amount)) {
    throw new Error(
      `Transfer amount is too low: ${cChainExportTxnFeeInNanoAvax} nAVAX Fee is required for C chain export txn, but only ${weiToNanoAvax(
        params.amount
      )} nAVAX is being transferred, try sending a higher amount.`
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
  const pChainImportTxnFeeInNanoAvax = pvm.calculateFee(
    pChainImportTxnRequest.tx.getTx(),
    context.platformFeeConfig.weights,
    pChainFeeState.price
  );

  // Calculate the total fee
  const totalFeeInNanoAvax =
    pChainImportTxnFeeInNanoAvax + cChainExportTxnFeeInNanoAvax;
  if (totalFeeInNanoAvax > weiToNanoAvax(params.amount)) {
    throw new Error(
      `Transfer amount is too low: ${pChainImportTxnFeeInNanoAvax} nAVAX Fee is required for P chain import txn, 
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
