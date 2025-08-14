import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheFuji } from "@avalanche-sdk/client/chains";
import { loadConfig } from "../../config";

async function run() {
  // The account that will be used to sign the transaction
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

  const pChainConvertSubnetToL1TxnRequest =
    await walletClient.pChain.prepareConvertSubnetToL1Txn({
      // The subnet that will be converted to an L1
      // You can find the subnetId in the createSubnetTx
      subnetId: "2qYCjAVYAtmmi2NnFSXmXHCzs99fWxAfxYQY2b6L9Agduf3Syd",
      // You can find the blockchainId in the createChainTx txHash
      blockchainId: "2cgxZU4DpYPSim7R4hTUQ7LavoeVYWki4LYKhrCiN27DZzkmoa",
      // You can pre deploy a proxy contract for the validator manager contract in the createChainTx
      managerContractAddress: "0xfacade0000000000000000000000000000000000",
      validators: [
        {
          // You can find the nodeId and nodePoP details from the info.getNodeID() route or Data APIs
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
            addresses: [account.getXPAddress("P", "fuji")],
            threshold: 1,
          },
          deactivationOwner: {
            addresses: [account.getXPAddress("P", "fuji")],
            threshold: 1,
          },
        },
      ],
      subnetAuth: [0],
    });

  // Signing and sending the convert subnet to L1 transaction request to the P-chain with account
  const sendTxnResponse = await walletClient.sendXPTransaction(
    pChainConvertSubnetToL1TxnRequest
  );

  console.log("Convert subnet to L1 transaction sent", sendTxnResponse);
  await walletClient.waitForTxn(sendTxnResponse);
}

run();
