import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheFuji } from "@avalanche-sdk/client/chains";
import { issueTx as issueCChainTx } from "@avalanche-sdk/client/methods/cChain";

async function run() {
  const account = privateKeyToAvalancheAccount(
    "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce"
  );

  const client = createAvalancheWalletClient({
    chain: avalancheFuji,
    transport: {
      type: "http",
      url: "https://api.avax-test.network/ext/bc/C/rpc",
    },
    account,
  });

  const cChainExportTxnRequest = await client.cChain.prepareExportTxn({
    destinationChain: "P",
    fromAddress: "0x76Dd3d7b2f635c2547B861e55aE8A374E587742D",
    exportedOutput: {
      addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
      amountInAvax: 0.0001,
    },
  });

  // To sign and issue the txn, you can use one of the following code:
  // 1. Sign the txn and issue it manually

  // sign the txn
  const signedTx = await client.signXPTransaction(cChainExportTxnRequest);

  // issue the txn
  const issuedTxnResponse = await issueCChainTx(client.cChainClient, {
    tx: signedTx.signedTxHex,
    encoding: "hex",
  });

  console.log("issuedTxnResponse", issuedTxnResponse);

  // 2. Sign the txn and issue it in one go
  const sendTxnResponse = await client.sendXPTransaction(
    cChainExportTxnRequest
  );

  console.log("sendTxnResponse", sendTxnResponse);
}

run();
