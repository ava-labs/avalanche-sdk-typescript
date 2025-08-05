import { createTransport, EIP1193RequestFn } from "viem";
import { expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheWalletCoreClient } from "../createAvalancheWalletCoreClient.js";
import { xChainWalletActions } from "./xChainWallet.js";

const mockTransport = () =>
  createTransport({
    key: "mock",
    name: "Mock Transport",
    request: vi.fn(async ({ method }) => {
      switch (method) {
        case "avm.prepareBaseTxn":
          return {
            unsignedTx:
              "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
            encoding: "hex",
          };
        case "avm.prepareExportTxn":
          return {
            unsignedTx:
              "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
            encoding: "hex",
          };
        case "avm.prepareImportTxn":
          return {
            unsignedTx:
              "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
            encoding: "hex",
          };
        default:
          return {
            result: {
              someKey: 1,
            },
          };
      }
    }) as unknown as EIP1193RequestFn,
    type: "mock",
  });

const client = createAvalancheWalletCoreClient({
  chain: avalanche,
  transport: { type: "http" },
} as any);

const xChainWalletClient = xChainWalletActions(client);

test("default", async () => {
  expect(xChainWalletClient).toMatchInlineSnapshot(`{
  "prepareBaseTxn": [Function],
  "prepareExportTxn": [Function],
  "prepareImportTxn": [Function],
}`);
});
