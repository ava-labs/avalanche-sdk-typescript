import {
  avaxSerial,
  Credential,
  Signature,
  UnsignedTx,
  utils,
} from "@avalabs/avalanchejs";
import { getTxFromBytes } from "src/utils/getTxFromBytes.js";
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
export async function sendXPTransaction(
  client: AvalancheWalletCoreClient,
  params: SendXPTransactionParameters
): Promise<SendXPTransactionReturnType> {
  const { txOrTxHex, chainAlias, account, ...rest } = params;

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
          let credentials: Credential[] = [];
          const txSigIndices = tx.getSigIndices();
          if (credentials.length === 0) {
            credentials = txSigIndices.map((sigs) => {
              const signatures = sigs.map((_) => {
                return new Signature(signature);
              });
              return new Credential(signatures);
            });
          }

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
      params: Omit<SendXPTransactionParameters, "account" | "txOrTxHex"> & {
        transactionHex: string;
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
    },
  });
}
