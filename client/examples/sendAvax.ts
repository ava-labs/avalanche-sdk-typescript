import { createAvalancheWalletClient } from "@avalanche-sdk/client";
import { privateKeyToAvalancheAccount } from "@avalanche-sdk/client/accounts";
import { avalancheFuji } from "@avalanche-sdk/client/chains";

async function run() {
  // This is the private key of the account that will be used to export the avax from the X-chain to the P-chain
  const account = privateKeyToAvalancheAccount(
    "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce"
  );

  // This is the wallet client that will be used to export the avax from the X-chain to the P-chain
  const walletClient = createAvalancheWalletClient({
    chain: avalancheFuji,
    transport: {
      type: "http",
    },
    account,
  });

  // 1. Send avax to another address on C-chain from C-chain
  // Creates a transaction, signs, sends and waits for the transaction to
  // be confirmed on C-chain
  const sendC2CResponse = await walletClient.send({
    to: "0x909d71Ed4090ac6e57E3645dcF2042f8c6548664",
    amount: 0.001,
  });
  console.log("sendC2CResponse", sendC2CResponse);

  // 2. Send avax to another address on P-chain from C-chain
  // Creates a export and import transaction, signs, sends and waits for
  // the transaction to be confirmed on C-chain and P-chain
  const sendC2PResponse = await walletClient.send({
    to: "P-fuji1apmh7wxg3js48fhacfv5y9md9065jxuf8rtns7",
    amount: 0.001,
    destinationChain: "P",
  });
  console.log("sendC2PResponse", sendC2PResponse);

  // 3. Send avax to another address on C-chain from P-chain
  // Creates a export and import transaction, signs, sends and waits for
  // the transaction to be confirmed on C-chain and P-chain
  const sendP2CResponse = await walletClient.send({
    to: "0x909d71Ed4090ac6e57E3645dcF2042f8c6548664",
    amount: 0.001,
    sourceChain: "P",
    destinationChain: "C",
  });
  console.log("sendP2CResponse", sendP2CResponse);

  // 4. Send avax to another address on P-chain from P-chain
  const sendP2PResponse = await walletClient.send({
    to: "P-fuji1apmh7wxg3js48fhacfv5y9md9065jxuf8rtns7",
    amount: 0.001,
    sourceChain: "P",
    destinationChain: "P",
  });
  console.log("sendP2PResponse", sendP2PResponse);
}

run();
