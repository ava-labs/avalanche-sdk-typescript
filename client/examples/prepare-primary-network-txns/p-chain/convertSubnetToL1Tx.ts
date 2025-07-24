import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheFuji } from "@avalanche-sdk/client/chains";

async function run() {
  const account = privateKeyToAvalancheAccount(
    "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce"
  );

  const walletClient = createAvalancheWalletClient({
    chain: avalancheFuji,
    transport: {
      type: "http",
      url: "https://api.avax-test.network/ext/bc/C/rpc",
    },
    account,
  });

  const pChainConvertSubnetToL1TxnRequest =
    await walletClient.pChain.prepareConvertSubnetToL1Txn({
      subnetId: "2qYCjAVYAtmmi2NnFSXmXHCzs99fWxAfxYQY2b6L9Agduf3Syd",
      blockchainId: "2cgxZU4DpYPSim7R4hTUQ7LavoeVYWki4LYKhrCiN27DZzkmoa",
      // You can pre deploy a proxy contract for the validator manager contract in the createChainTx
      managerContractAddress: "0xfacade0000000000000000000000000000000000",
      validators: [
        {
          nodeId: "NodeID-CMpZrrUoevB2qPYD3w1TncAzdqQ8qdk4x",
          nodePoP: {
            publicKey:
              "0x94ab445df7ca4158cf63b66b6c463e9995b380441863f89231d3cd468ecdf7a96b080d3e96e20d74d9f2cd4f96d9dc40",
            proofOfPossession:
              "0x985b38c12afbe3ff90161f451bf2290cd6c03c3acd0a7346e346820ab4d27c200036cd9c7a828548eec5c6a5304339c400d1eb6f73e381479c4356df57938d4792f7fb9256a5817c16fb514bd27e8d9fc5c5a02470d721bb34064e90a19174df",
          },
          weight: 100n,
          initialBalanceInAvax: 0.1,
          remainingBalanceOwner: {
            addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
            threshold: 1,
          },
          deactivationOwner: {
            addresses: ["P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz"],
            threshold: 1,
          },
        },
      ],
      subnetAuth: [0],
    });

  const sendTxnResponse = await walletClient.sendXPTransaction(
    pChainConvertSubnetToL1TxnRequest
  );

  console.log("Convert subnet to L1 transaction sent", sendTxnResponse);
  await walletClient.waitForTxn(sendTxnResponse);
}

run();
