import { Hex } from "viem";
import { parseAvalancheAccount } from "../../accounts/utils/parseAvalancheAccount.js";
import { AvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
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
  const { txHex, chainAlias, account, ...rest } = params;

  const paramAc = parseAvalancheAccount(account);
  const xpAccount = paramAc?.xpAccount || client.xpAccount;

  if (xpAccount) {
    // createTx from transactionHex

    switch (chainAlias) {
      case "P":
        let signedTxRes = await signXPTransaction(client, {
          txOrTxHex: txHex,
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
        throw new Error("C-Chain is not supported for XP transactions");
      case "X":
        signedTxRes = await signXPTransaction(client, {
          txOrTxHex: txHex,
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
      params: Omit<SendXPTransactionParameters, "account">;
    },
    SendXPTransactionReturnType
  >({
    method: "avalanche_sendTransaction",
    params: {
      ...rest,
      txHex,
      chainAlias,
    },
  });
}
