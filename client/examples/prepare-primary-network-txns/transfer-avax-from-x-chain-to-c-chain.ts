import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheFuji } from "@avalanche-sdk/client/chains";
import { avaxToNanoAvax } from "@avalanche-sdk/client/utils";
import { loadConfig } from "../config";

async function run() {
  const { privateKeyAccount1 } = loadConfig();
  const account = privateKeyToAvalancheAccount(privateKeyAccount1);

  // This is the wallet client that will be used to export the avax from the X-chain to the C-chain
  const walletClient = createAvalancheWalletClient({
    chain: avalancheFuji,
    transport: {
      type: "http",
      url: "https://api.avax-test.network/ext/bc/C/rpc",
    },
    account,
  });

  // Creating a export transaction request from the X-chain to the C-chain
  // Keep in mind that if the amount of avax exported is too small then import txn in C-chain
  // might fail due to the fee being too high
  const xChainExportTxnRequest = await walletClient.xChain.prepareExportTxn({
    exportedOutputs: [
      {
        addresses: [account.getXPAddress("X", "fuji")], // X-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz
        amount: avaxToNanoAvax(0.0001), // 0.0001 AVAX = 100_000 nAVAX
      },
    ],
    destinationChain: "C",
  });

  // Signing and sending the export transaction request to the X-chain
  const sendTxnResponse = await walletClient.sendXPTransaction(
    xChainExportTxnRequest
  );

  // Waiting for the export transaction to be confirmed on the X-chain
  await walletClient.waitForTxn(sendTxnResponse);

  // Logging the export transaction response
  console.log("Avax exported from X-chain to C-chain", sendTxnResponse);

  // Creating a import transaction request in C-chain
  const cChainImportTxnRequest = await walletClient.cChain.prepareImportTxn({
    sourceChain: "X",
    toAddress: account.getEVMAddress(), // 0x76Dd3d7b2f635c2547B861e55aE8A374E587742D
  });

  // Signing and sending the import transaction request to the C-chain
  const sendTxnResponse2 = await walletClient.sendXPTransaction(
    cChainImportTxnRequest
  );

  // Waiting for the import transaction to be confirmed on the C-chain
  await walletClient.waitForTxn(sendTxnResponse2);

  // Logging the import transaction response
  console.log(
    "Avax imported from Atomic Memory for X-chain to C-chain transfer",
    sendTxnResponse2
  );
}

run();
