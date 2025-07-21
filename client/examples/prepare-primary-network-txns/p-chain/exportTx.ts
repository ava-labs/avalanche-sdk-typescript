import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheFuji } from "@avalanche-sdk/client/chains";
import { issueTx as issuePChainTx } from "@avalanche-sdk/client/methods/pChain";

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

  const pChainExportTxnRequest = await client.pChain.prepareExportTxn({
    exportedOutputs: [
      {
        addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
        amount: 0.00001,
      },
    ],
    destinationChain: "C",
  });

  // To sign and issue the txn, you can use one of the following code:
  // 1. Sign the txn and issue it manually

  // sign the txn
  const signedTx = await client.signXPTransaction(pChainExportTxnRequest);

  // issue the txn
  const issuedTxnResponse = await issuePChainTx(client.pChainClient, {
    tx: signedTx.signedTxHex,
    encoding: "hex",
  });

  console.log("issuedTxnResponse", issuedTxnResponse);

  // 2. Sign the txn and issue it in one go
  const sendTxnResponse = await client.sendXPTransaction(
    pChainExportTxnRequest
  );

  console.log("sendTxnResponse", sendTxnResponse);
}

run();
