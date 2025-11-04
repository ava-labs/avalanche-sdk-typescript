import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheFuji } from "@avalanche-sdk/client/chains";
import { issueTx as issuePChainTx } from "@avalanche-sdk/client/methods/pChain";
import { avaxToNanoAvax } from "@avalanche-sdk/client/utils";
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

  const pChainExportTxnRequest = await walletClient.pChain.prepareExportTxn({
    exportedOutputs: [
      {
        addresses: [account.getXPAddress("P", "fuji")], // P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz
        amount: avaxToNanoAvax(0.00001), // 0.00001 AVAX = 10_000 nAVAX
      },
    ],
    destinationChain: "C",
  });

  // To sign and issue the txn, you can use one of the following code:
  // 1. Sign the txn and issue it manually

  // sign the txn
  const signedTx = await walletClient.signXPTransaction(pChainExportTxnRequest);

  // issue the txn
  const issuedTxnResponse = await issuePChainTx(walletClient.pChainClient, {
    tx: signedTx.signedTxHex,
    encoding: "hex",
  });

  console.log("issuedTxnResponse", issuedTxnResponse);

  // 2. Sign the txn and issue it in one go
  const sendTxnResponse = await walletClient.sendXPTransaction(
    pChainExportTxnRequest
  );

  console.log("sendTxnResponse", sendTxnResponse);
}

run();
