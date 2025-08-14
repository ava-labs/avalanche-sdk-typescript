import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheFuji } from "@avalanche-sdk/client/chains";
import { issueTx as issueXChainTx } from "@avalanche-sdk/client/methods/xChain";
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

  const xChainImportTxnRequest = await walletClient.xChain.prepareImportTxn({
    sourceChain: "C",
    importedOutput: {
      addresses: [account.getXPAddress("X", "fuji")], // X-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz
    },
  });

  // To sign and issue the txn, you can use one of the following code:
  // 1. Sign the txn and issue it manually

  // sign the txn
  const signedTx = await walletClient.signXPTransaction(xChainImportTxnRequest);

  // issue the txn
  const issuedTxnResponse = await issueXChainTx(walletClient.xChainClient, {
    tx: signedTx.signedTxHex,
    encoding: "hex",
  });

  console.log("issuedTxnResponse", issuedTxnResponse);

  // 2. Sign the txn and issue it in one go
  const sendTxnResponse = await walletClient.sendXPTransaction(
    xChainImportTxnRequest
  );

  console.log("sendTxnResponse", sendTxnResponse);
}

run();
