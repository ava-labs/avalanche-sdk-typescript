import { UnsignedTx, utils } from "@avalabs/avalanchejs";
import { Hex } from "viem";
import { parseAvalancheAccount } from "../../accounts/utils/parseAvalancheAccount.js";
import { AvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { getTxFromBytes } from "../../utils/getTxFromBytes.js";
import { issueTx as issueTxCChain } from "../cChain/issueTx.js";
import { issueTx as issueTxPChain } from "../pChain/issueTx.js";
import { issueTx as issueTxXChain } from "../xChain/issueTx.js";
import { AvalancheWalletRpcSchema } from "./avalancheWalletRPCSchema.js";
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
    const [tx] = getTxFromBytes(txHex, chainAlias);
    const signature = utils.hexToBuffer(await xpAccount.signTransaction(txHex));
    const unsignedTx = new UnsignedTx(tx, [], new utils.AddressMaps());
    unsignedTx.addSignature(signature);
    const signedTx = utils.bufferToHex(
      utils.addChecksum(unsignedTx.getSignedTx().toBytes())
    );
    switch (chainAlias) {
      case "P":
        const issueTxPChainResponse = await issueTxPChain(client.pChainClient, {
          tx: signedTx,
          encoding: "hex",
        });
        return {
          txHash: issueTxPChainResponse.txID as Hex,
        };
      case "C":
        const issueTxCChainResponse = await issueTxCChain(client.cChainClient, {
          tx: signedTx,
          encoding: "hex",
        });
        return {
          txHash: issueTxCChainResponse.txID as Hex,
        };
      case "X":
        const issueTxXChainResponse = await issueTxXChain(client.xChainClient, {
          tx: signedTx,
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
