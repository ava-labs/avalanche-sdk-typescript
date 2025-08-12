import { utils } from "@avalabs/avalanchejs";
import { Hex } from "viem";
import { parseAvalancheAccount } from "../../accounts/utils/parseAvalancheAccount.js";
import { AvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { issueTx as issueTxCChain } from "../cChain/issueTx.js";
import { issueTx as issueTxPChain } from "../pChain/issueTx.js";
import { issueTx as issueTxXChain } from "../xChain/issueTx.js";
import { AvalancheWalletRpcSchema } from "./avalancheWalletRPCSchema.js";
import { signXPTransaction } from "./signXPTransaction.js";
import {
  SendXPTransactionParameters,
  SendXPTransactionReturnType,
} from "./types/sendXPTransaction.js";

/**
 * Send an transaction to the X, P or C chain
 * @param client - The client to use {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the transaction {@link SendXPTransactionParameters}
 * @returns The transaction hash {@link SendXPTransactionReturnType}
 *
 * @example
 *
 * import { createWalletCoreClient, http } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { sendXPTransaction } from '@avalanche-sdk/client/methods/wallet'
 *
 * const client = createWalletCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "custom",
 *     provider: window.avalanche!,
 *   },
 * })
 *
 * const txHash = await sendXPTransaction(client, {
 *   txOrTxHex: "0x...",
 *   chainAlias: "P",
 * })
 *
 */
export async function sendXPTransaction(
  client: AvalancheWalletCoreClient,
  params: SendXPTransactionParameters
): Promise<SendXPTransactionReturnType> {
  const {
    tx: txOrTxHex,
    chainAlias,
    account,
    utxoIds,
    subnetAuth,
    subnetOwners,
    disableOwners,
    disableAuth,
    ...rest
  } = params;

  const paramAc = parseAvalancheAccount(account);
  const xpAccount = paramAc?.xpAccount || client.xpAccount;

  if (xpAccount) {
    let signedTxRes = await signXPTransaction(client, {
      tx: txOrTxHex,
      chainAlias,
      subnetOwners,
      subnetAuth,
      disableOwners,
      disableAuth,
    });

    const issueTx = (args: any) => {
      switch (chainAlias) {
        case "P":
          return issueTxPChain(client.pChainClient, args);
        case "C":
          return issueTxCChain(client.cChainClient, args);
        case "X":
          return issueTxXChain(client.xChainClient, args);
      }
    };

    const issueTxResponse = await issueTx({
      tx: signedTxRes.signedTxHex,
      encoding: "hex",
    });

    return {
      txHash: issueTxResponse.txID as Hex,
      chainAlias,
    };
  }

  const response = await client.request<
    AvalancheWalletRpcSchema,
    {
      method: "avalanche_sendTransaction";
      params: Omit<
        SendXPTransactionParameters,
        | "account"
        | "tx"
        | "utxoIds"
        | "subnetAuth"
        | "subnetOwners"
        | "disableOwners"
        | "disableAuth"
      > & {
        transactionHex: string;
        utxos: string[] | undefined;
      };
    },
    string
  >({
    method: "avalanche_sendTransaction",
    params: {
      externalIndices: rest.externalIndices,
      internalIndices: rest.internalIndices,
      feeTolerance: rest.feeTolerance,
      transactionHex:
        typeof txOrTxHex === "string"
          ? txOrTxHex
          : utils.bufferToHex(txOrTxHex.toBytes()),
      chainAlias,
      utxos: utxoIds,
    },
  });

  return {
    txHash: response,
    chainAlias,
  };
}
