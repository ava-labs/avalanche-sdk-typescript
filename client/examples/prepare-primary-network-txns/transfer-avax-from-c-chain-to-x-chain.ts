import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheFuji } from "@avalanche-sdk/client/chains";
import { avaxToNanoAvax } from "@avalanche-sdk/client/utils";
import { loadConfig } from "../config";

async function run() {
  const { privateKeyAccount1 } = loadConfig();
  const account = privateKeyToAvalancheAccount(privateKeyAccount1);

  // This is the wallet client that will be used to export the avax from the C-chain to the X-chain
  const walletClient = createAvalancheWalletClient({
    chain: avalancheFuji,
    transport: {
      type: "http",
      url: "https://api.avax-test.network/ext/bc/C/rpc",
    },
    account,
  });

  // Creating a export transaction request from the C-chain to the X-chain
  const cChainExportTxnRequest = await walletClient.cChain.prepareExportTxn({
    destinationChain: "X",
    fromAddress: account.getEVMAddress(), // 0x76Dd3d7b2f635c2547B861e55aE8A374E587742D
    exportedOutput: {
      addresses: [account.getXPAddress("X", "fuji")], // X-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz
      amount: avaxToNanoAvax(0.0011), // 0.0011 AVAX = 1_100_000 nAVAX
    },
  });

  // Signing and sending the export transaction request to the C-chain
  const sendTxnResponse = await walletClient.sendXPTransaction(
    cChainExportTxnRequest
  );

  // Waiting for the export transaction to be confirmed on the C-chain
  await walletClient.waitForTxn(sendTxnResponse);

  // Logging the export transaction response
  console.log(
    "Avax exported to Atomic Memory for C-chain to X-chain transfer",
    sendTxnResponse
  );

  // Creating a import transaction request in X-chain
  const xChainImportTxnRequest = await walletClient.xChain.prepareImportTxn({
    sourceChain: "C",
    importedOutput: {
      addresses: [account.getXPAddress("X", "fuji")], // X-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz
    },
  });

  // Signing and sending the import transaction request to the P-chain
  const sendTxnResponse2 = await walletClient.sendXPTransaction(
    xChainImportTxnRequest
  );

  // Waiting for the import transaction to be confirmed on the P-chain
  await walletClient.waitForTxn(sendTxnResponse2);

  // Logging the import transaction response
  console.log(
    "Avax imported from Atomic Memory from C-chain to X-chain transfer",
    sendTxnResponse2
  );
}

run();
