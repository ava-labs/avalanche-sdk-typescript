import {
  avaxSerial,
  Credential,
  Signature,
  UnsignedTx,
  utils,
} from "@avalabs/avalanchejs";
import { Hex } from "viem";
import { parseAvalancheAccount } from "../../accounts/utils/parseAvalancheAccount.js";
import { AvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { getTxFromBytes } from "../../utils/getTxFromBytes.js";
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
 * import { createWalletCoreClient, http } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { sendXPTransaction } from '@avalanche-sdk/rpc/methods/wallet'
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
  const { txOrTxHex, chainAlias, account, utxoIds, ...rest } = params;

  const paramAc = parseAvalancheAccount(account);
  const xpAccount = paramAc?.xpAccount || client.xpAccount;

  if (xpAccount) {
    switch (chainAlias) {
      case "P":
        let signedTxRes = await signXPTransaction(client, {
          txOrTxHex: txOrTxHex,
          chainAlias: chainAlias as "X" | "P",
        });

        const issueTxPChainResponse = await issueTxPChain(client.pChainClient, {
          tx: signedTxRes.signedTxHex,
          encoding: "hex",
        });
        return {
          txHash: issueTxPChainResponse.txID as Hex,
        };
      case "C":
        if (typeof txOrTxHex === "string") {
          // Get the tx and credentials from the txHex
          let [tx] = getTxFromBytes(txOrTxHex, "C");

          // Get the signature for the tx
          const signature = utils.hexToBuffer(
            await xpAccount.signTransaction(txOrTxHex as Hex)
          );

          // Create the credentials array
          const txSigIndices = tx.getSigIndices();
          const credentials = txSigIndices.map((sigs) => {
            const signatures = sigs.map((_) => {
              return new Signature(signature);
            });
            return new Credential(signatures);
          });

          // Serialize the signed tx
          const signedTx = utils.bufferToHex(
            utils.addChecksum(
              new avaxSerial.SignedTx(tx, credentials).toBytes()
            )
          ) as Hex;

          // Issue the tx
          const issueTxCChainResponse = await issueTxCChain(
            client.cChainClient,
            {
              tx: signedTx,
              encoding: "hex",
            }
          );
          return {
            txHash: issueTxCChainResponse.txID as Hex,
          };
        } else {
          const tx = txOrTxHex as UnsignedTx;
          const signature = await xpAccount.signTransaction(tx.toBytes());
          tx.addSignature(utils.hexToBuffer(signature));
          const issueTxCChainResponse = await issueTxCChain(
            client.cChainClient,
            {
              tx: utils.bufferToHex(tx.getSignedTx().toBytes()),
              encoding: "hex",
            }
          );
          return {
            txHash: issueTxCChainResponse.txID as Hex,
          };
        }
      case "X":
        signedTxRes = await signXPTransaction(client, {
          txOrTxHex: txOrTxHex,
          chainAlias: chainAlias as "X" | "P",
        });
        const issueTxXChainResponse = await issueTxXChain(client.xChainClient, {
          tx: signedTxRes.signedTxHex,
          encoding: "hex",
        });
        return {
          txHash: issueTxXChainResponse.txID as Hex,
        };
      default:
        throw new Error(`Unsupported chain alias: ${chainAlias}`);
    }
  }

  return client.request<
    AvalancheWalletRpcSchema,
    {
      method: "avalanche_sendTransaction";
      params: Omit<
        SendXPTransactionParameters,
        "account" | "txOrTxHex" | "utxoIds"
      > & {
        transactionHex: string;
        utxos: string[] | undefined;
      };
    },
    SendXPTransactionReturnType
  >({
    method: "avalanche_sendTransaction",
    params: {
      ...rest,
      transactionHex:
        typeof txOrTxHex === "string"
          ? txOrTxHex
          : utils.bufferToHex(txOrTxHex.toBytes()),
      chainAlias,
      utxos: utxoIds,
    },
  });
}
