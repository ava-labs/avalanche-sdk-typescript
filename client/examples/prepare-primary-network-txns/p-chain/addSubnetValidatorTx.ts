import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheFuji } from "@avalanche-sdk/client/chains";
import { issueTx as issuePChainTx } from "@avalanche-sdk/client/methods/pChain";

async function run() {
  const account1 = privateKeyToAvalancheAccount(
    "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce"
  );
  const account2 = privateKeyToAvalancheAccount(
    "0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"
  );

  const client = createAvalancheWalletClient({
    chain: avalancheFuji,
    transport: {
      type: "http",
      url: "https://api.avax-test.network/ext/bc/C/rpc",
    },
    account: account1,
  });

  const addSubnetValidatorTxnRequest =
    await client.pChain.prepareAddSubnetValidatorTxn({
      subnetId: "SLomSuJLyG9qk7KLcWevdcZ1i7kN2qTLNUytJLhkwPdxAAgoa",
      nodeId: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      end: BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 2), // 2 days
      subnetAuth: [0],
      weight: BigInt(12345),
    });

  // sign the txn with account1
  const partiallySignedTxn = await client.signXPTransaction(
    addSubnetValidatorTxnRequest
  );

  // sign the txn with account2
  const signedTxn = await client.signXPTransaction({
    ...partiallySignedTxn,
    account: account2,
  });

  // issue the txn
  const issuedTxnResponse = await issuePChainTx(client.pChainClient, {
    tx: signedTxn.signedTxHex,
    encoding: "hex",
  });

  console.log("issuedTxnResponse", issuedTxnResponse);
}

run();
