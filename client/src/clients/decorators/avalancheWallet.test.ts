import { expect, test } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheWalletCoreClient } from "../createAvalancheWalletCoreClient.js";
import { avalancheWalletActions } from "./avalancheWallet.js";

const client = createAvalancheWalletCoreClient({
  chain: avalanche,
  transport: { type: "http" },
} as any);

const avalancheWalletClient = avalancheWalletActions(client);

test("default", async () => {
  expect(avalancheWalletClient).toMatchInlineSnapshot(`{
  "getAccountPubKey": [Function],
  "sendXPTransaction": [Function],
  "signXPMessage": [Function],
  "signXPTransaction": [Function],
  "waitForTxn": [Function],
}`);
});
