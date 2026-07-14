import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheFuji } from "@avalanche-sdk/client/chains";
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

  const setAutoRenewedValidatorConfigTxnRequest =
    await walletClient.pChain.prepareSetAutoRenewedValidatorConfigTxn({
      validatorTxId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      auth: [0],
      period: 14n * 24n * 60n * 60n,
      autoCompoundRewardPercentage: 30,
    });

  const sendTxnResponse = await walletClient.sendXPTransaction(
    setAutoRenewedValidatorConfigTxnRequest
  );

  console.log(
    "Set auto-renewed validator config transaction sent",
    sendTxnResponse
  );
  await walletClient.waitForTxn(sendTxnResponse);
}

run();
