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

  const createChainTxnRequest = await walletClient.pChain.prepareCreateChainTxn(
    {
      subnetId: "SLomSuJLyG9qk7KLcWevdcZ1i7kN2qTLNUytJLhkwPdxAAgoa",
      vmId: "mDtV8ES8wRL1j2m6Kvc1qRFAvnpq4kufhueAY1bwbzVhk336o",
      chainName: "test chain avalanche sdk",
      fromAddresses: [
        "P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz",
        "P-fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t",
      ],
      genesisData: {},
      subnetAuth: [0],
    }
  );

  // sign the txn with account1
  const partiallySignedTxn = await walletClient.signXPTransaction(
    createChainTxnRequest
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
