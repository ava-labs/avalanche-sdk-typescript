import { pvm } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { getBalance } from "../../pChain/getBalance.js";
import { getFeeState } from "../../pChain/getFeeState.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { prepareBaseTxn } from "../pChain/prepareBaseTxn.js";
import { sendXPTransaction } from "../sendXPTransaction.js";
import { SendParameters, SendReturnType } from "../types/send.js";
import {
  getBech32AddressFromAccountOrClient,
  nanoAvaxToAvax,
} from "../utils.js";
import { waitForTxn } from "../waitForTxn.js";

export type TransferPtoPChainParameters = SendParameters;

export type TransferPtoPChainReturnType = SendReturnType;

export async function transferPtoPChain(
  client: AvalancheWalletCoreClient,
  params: TransferPtoPChainParameters
): Promise<TransferPtoPChainReturnType> {
  const context = params.context || (await getContextFromURI(client));
  const isTestnet = context.networkID === 5;

  // Get the current account P chain address
  const currentAccountPChainAddress = await getBech32AddressFromAccountOrClient(
    client,
    params.account,
    "P",
    isTestnet ? "fuji" : "avax"
  );

  // Validate the destination address
  if (!params.to.startsWith("P-")) {
    throw new Error("Invalid P chain address, it should start with P-");
  }

  // Prepare the base transaction and get the fee state and balance
  const [baseTxnRequest, pChainFeeState, balance] = await Promise.all([
    prepareBaseTxn(client, {
      fromAddresses: [currentAccountPChainAddress],
      outputs: [
        {
          addresses: [params.to],
          amount: params.amount,
        },
      ],
      context,
    }),
    getFeeState(client.pChainClient),
    nanoAvaxToAvax(
      (
        await getBalance(client.pChainClient, {
          addresses: [currentAccountPChainAddress],
        })
      ).balance
    ),
  ]);

  // Calculate the fee for the base transaction
  const baseTxnFee = pvm.calculateFee(
    baseTxnRequest.tx.getTx(),
    context.platformFeeConfig.weights,
    pChainFeeState.price
  );

  if (Number(balance) < params.amount) {
    throw new Error(
      `Insufficient balance: ${params.amount} AVAX is required, but only ${balance} AVAX is available`
    );
  }

  if (nanoAvaxToAvax(baseTxnFee) > params.amount) {
    throw new Error(
      `Transfer amount is too low: ${nanoAvaxToAvax(
        baseTxnFee
      )} AVAX Fee is required, but only ${
        params.amount
      } AVAX is being transferred`
    );
  }

  const sendBaseTxn = await sendXPTransaction(client, baseTxnRequest);
  await waitForTxn(client, sendBaseTxn);
  return {
    txHashes: [
      {
        txHash: sendBaseTxn.txHash,
        chainAlias: "P",
      },
    ],
  };
}
