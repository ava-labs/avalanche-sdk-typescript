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

  const removeSubnetValidatorTxnRequest =
    await walletClient.pChain.prepareRemoveSubnetValidatorTxn({
      subnetId: "SLomSuJLyG9qk7KLcWevdcZ1i7kN2qTLNUytJLhkwPdxAAgoa",
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      subnetAuth: [0],
    });

  // sign the txn with account1
  const partiallySignedTxn = await walletClient.signXPTransaction(
    removeSubnetValidatorTxnRequest
  );

  // sign the txn with account2
  const signedTxn = await walletClient.signXPTransaction({
    ...partiallySignedTxn,
    account: account2,
  });

  // issue the txn
  const issuedTxnResponse = await issuePChainTx(walletClient.pChainClient, {
    tx: signedTxn.signedTxHex,
    encoding: "hex",
  });

  console.log("issuedTxnResponse", issuedTxnResponse);
}

run();
