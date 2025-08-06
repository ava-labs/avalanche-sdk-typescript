import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheFuji } from "@avalanche-sdk/client/chains";
import { issueTx as issueXChainTx } from "@avalanche-sdk/client/methods/xChain";

async function run() {
  const account = privateKeyToAvalancheAccount(
    "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce"
  );

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
      addresses: ["X-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
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
