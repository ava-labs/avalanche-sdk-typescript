import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheFuji } from "@avalanche-sdk/client/chains";
import { avaxToNanoAvax } from "@avalanche-sdk/client/utils";
import { loadConfig } from "../../config";

async function run() {
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

  const addAutoRenewedValidatorTxnRequest =
    await walletClient.pChain.prepareAddAutoRenewedValidatorTxn({
      nodeId: "NodeID-CMpZrrUoevB2qPYD3w1TncAzdqQ8qdk4x",
      stakeInNanoAvax: avaxToNanoAvax(2000),
      period: 14n * 24n * 60n * 60n,
      rewardAddresses: [account.getXPAddress("P", "fuji")],
      delegatorRewardAddresses: [account.getXPAddress("P", "fuji")],
      ownerAddresses: [account.getXPAddress("P", "fuji")],
      publicKey:
        "0x85025bca6a302dc61338ff49c8baa572ded3e86f3759304c7f618a2a2593c187e080a3cfdec95040309ad1f158953067",
      signature:
        "0x8b1d6133d17e3483220ad960b6fde11e4e1214a8ce21ef616227e5d5eef070d7500e6f7d4452c5a760620cc06795cbe218e072eba76d94788d9d01176ce4ecadfb96b47f942281894ddfadd1c1743f7f549f1d07d59d55655927f72bc6bf7c12",
      delegatorRewardPercentage: 2,
      autoCompoundRewardPercentage: 100,
    });

  const sendTxnResponse = await walletClient.sendXPTransaction(
    addAutoRenewedValidatorTxnRequest
  );

  console.log("Add auto-renewed validator transaction sent", sendTxnResponse);
  await walletClient.waitForTxn(sendTxnResponse);
}

run();
