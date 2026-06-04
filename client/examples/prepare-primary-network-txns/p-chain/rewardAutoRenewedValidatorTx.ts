import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheFuji } from "@avalanche-sdk/client/chains";
import { issueTx as issuePChainTx } from "@avalanche-sdk/client/methods/pChain";
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

  const rewardAutoRenewedValidatorTxnRequest =
    await walletClient.pChain.prepareRewardAutoRenewedValidatorTxn({
      validatorTxId: "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH",
      timestamp: 1780576200n,
    });

  const issuedTxnResponse = await issuePChainTx(walletClient.pChainClient, {
    tx: rewardAutoRenewedValidatorTxnRequest.txHex,
    encoding: "hex",
  });

  console.log(
    "Reward auto-renewed validator transaction issued",
    issuedTxnResponse
  );
}

run();
