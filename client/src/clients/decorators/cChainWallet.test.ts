import { expect, test } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheWalletCoreClient } from "../createAvalancheWalletCoreClient.js";
import { cChainWalletActions } from "./cChainWallet.js";

const client = createAvalancheWalletCoreClient({
  chain: avalanche,
  transport: { type: "http" },
} as any);

const cChainWalletClient = cChainWalletActions(client);

test("default", async () => {
  expect(cChainWalletClient).toMatchInlineSnapshot(`{
  "prepareExportTxn": [Function],
  "prepareImportTxn": [Function],
}`);
});
