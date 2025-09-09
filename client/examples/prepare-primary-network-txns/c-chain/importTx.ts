import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheFuji } from "@avalanche-sdk/client/chains";
import { issueTx as issueCChainTx } from "@avalanche-sdk/client/methods/cChain";
import { loadConfig } from "../../config";

async function run() {
  const { privateKeyAccount1 } = loadConfig();
  const account = privateKeyToAvalancheAccount(privateKeyAccount1);

  const walletClient = createAvalancheWalletClient({
    chain: avalancheFuji,
    transport: {
      type: "http",
      url: "https://api.avax-test.network/ext/bc/C/rpc",
    },
    account,
  });

  const cChainImportTxnRequest = await walletClient.cChain.prepareImportTxn({
    sourceChain: "P",
    toAddress: account.getEVMAddress(), // 0x76Dd3d7b2f635c2547B861e55aE8A374E587742D
  });

  // To sign and issue the txn, you can use one of the following code:
  // 1. Sign the txn and issue it manually

  // sign the txn
  const signedTx = await walletClient.signXPTransaction(cChainImportTxnRequest);

  // issue the txn
  const issuedTxnResponse = await issueCChainTx(walletClient.cChainClient, {
    tx: signedTx.signedTxHex,
    encoding: "hex",
  });

  console.log("issuedTxnResponse", issuedTxnResponse);

  // 2. Sign the txn and issue it in one go
  const sendTxnResponse = await walletClient.sendXPTransaction(
    cChainImportTxnRequest
  );

  console.log("sendTxnResponse", sendTxnResponse);
}

run();
