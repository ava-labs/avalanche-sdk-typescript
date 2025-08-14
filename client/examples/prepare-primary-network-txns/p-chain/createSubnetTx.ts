import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheFuji } from "@avalanche-sdk/client/chains";
import { issueTx as issuePChainTx } from "@avalanche-sdk/client/methods/pChain";
import { loadConfig } from "../../config";

async function run() {
  const { privateKeyAccount1, privateKeyAccount2 } = loadConfig();
  const account1 = privateKeyToAvalancheAccount(privateKeyAccount1);
  const account2 = privateKeyToAvalancheAccount(privateKeyAccount2);

  const walletClient = createAvalancheWalletClient({
    chain: avalancheFuji,
    transport: {
      type: "http",
      url: "https://api.avax-test.network/ext/bc/C/rpc",
    },
    account: account1,
  });

  const customSubnetOwners = {
    addresses: [account2.getXPAddress("P", "fuji")], // P-fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t
    locktime: BigInt(123),
    threshold: 1,
  };
  const createSubnetTxnRequest =
    await walletClient.pChain.prepareCreateSubnetTxn({
      subnetOwners: customSubnetOwners,
    });

  // To sign and issue the txn, you can use one of the following code:
  // 1. Sign the txn and issue it manually

  // sign the txn
  const signedTx = await walletClient.signXPTransaction(createSubnetTxnRequest);

  // issue the txn
  const issuedTxnResponse = await issuePChainTx(walletClient.pChainClient, {
    tx: signedTx.signedTxHex,
    encoding: "hex",
  });

  console.log("issuedTxnResponse", issuedTxnResponse);

  // 2. Sign the txn and issue it in one go
  const sendTxnResponse = await walletClient.sendXPTransaction(
    createSubnetTxnRequest
  );

  console.log("sendTxnResponse", sendTxnResponse);
}

run();
