import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheFuji } from "@avalanche-sdk/client/chains";

async function run() {
  // This is the private key of the account that will be used to export the avax from the C-chain to the P-chain
  const account = privateKeyToAvalancheAccount(
    "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce"
  );

  // This is the wallet client that will be used to export the avax from the C-chain to the P-chain
  const walletClient = createAvalancheWalletClient({
    chain: avalancheFuji,
    transport: {
      type: "http",
      url: "https://api.avax-test.network/ext/bc/C/rpc",
    },
    account,
  });

  // Creating a export transaction request from the C-chain to the P-chain
  const cChainExportTxnRequest = await walletClient.cChain.prepareExportTxn({
    destinationChain: "P",
    fromAddress: account.getEVMAddress(), // 0x76Dd3d7b2f635c2547B861e55aE8A374E587742D
    exportedOutput: {
      addresses: [account.getXPAddress("P", "fuji")], // P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz
      amount: 0.0001,
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
    "Avax exported to Atomic Memory for C-chain to P-chain transfer",
    sendTxnResponse
  );

  // Creating a import transaction request in P-chain
  const pChainImportTxnRequest = await walletClient.pChain.prepareImportTxn({
    sourceChain: "C",
    importedOutput: {
      addresses: [account.getXPAddress("P", "fuji")], // P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz
    },
  });

  // Signing and sending the import transaction request to the P-chain
  const sendTxnResponse2 = await walletClient.sendXPTransaction(
    pChainImportTxnRequest
  );

  // Waiting for the import transaction to be confirmed on the P-chain
  await walletClient.waitForTxn(sendTxnResponse2);

  // Logging the import transaction response
  console.log(
    "Avax imported from Atomic Memory from C-chain to P-chain transfer",
    sendTxnResponse2
  );
}

run();
