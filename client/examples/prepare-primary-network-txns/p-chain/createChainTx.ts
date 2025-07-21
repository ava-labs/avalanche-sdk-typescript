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

  const createChainTxnRequest = await client.pChain.prepareCreateChainTxn({
    subnetId: "SLomSuJLyG9qk7KLcWevdcZ1i7kN2qTLNUytJLhkwPdxAAgoa",
    vmId: "mDtV8ES8wRL1j2m6Kvc1qRFAvnpq4kufhueAY1bwbzVhk336o",
    chainName: "test chain avalanche sdk",
    fromAddresses: [
      "P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz",
      "P-fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t",
    ],
    genesisData: {},
    subnetAuth: [0],
  });

  // sign the txn with account1
  const partiallySignedTxn = await client.signXPTransaction(
    createChainTxnRequest
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
