import { createTransport, EIP1193RequestFn } from "viem";
import { describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheCoreClient } from "../createAvalancheCoreClient.js";
import { xChainActions } from "./xChain.js";

const mockTransport = () =>
  createTransport({
    key: "mock",
    name: "Mock Transport",
    request: vi.fn(async ({ method }) => {
      switch (method) {
        // TODO: add proper responses for the rest of the methods
        // The default case is just a placeholder to satisfy the test
        case "avm.getAllBalances":
          return {
            balances: [{ assetID: "string", balance: 1n }],
          };
        case "avm.getBalance":
          return {
            balance: 1n,
            utxoIDs: [{ txID: "string", outputIndex: 1 }],
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

const client = createAvalancheCoreClient({
  chain: avalanche,
  transport: mockTransport,
});

const xChainClient = xChainActions(client);

test("default", async () => {
  expect(xChainClient).toMatchInlineSnapshot(`{
  "buildGenesis": [Function],
  "getAllBalances": [Function],
  "getAssetDescription": [Function],
  "getBalance": [Function],
  "getBlock": [Function],
  "getBlockByHeight": [Function],
  "getHeight": [Function],
  "getTx": [Function],
  "getTxFee": [Function],
  "getTxStatus": [Function],
  "getUTXOs": [Function],
  "issueTx": [Function],
}`);
});

describe("smoke test", () => {
  test("getAllBalances", async () => {
    const res = await xChainClient.getAllBalances({
      addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
    });
    expect(res).toBeDefined();
  });

  test("getAssetDescription", async () => {
    const res = await xChainClient.getAssetDescription({
      assetID: "string",
    });
    expect(res).toBeDefined();
  });

  test("getBalance", async () => {
    const res = await xChainClient.getBalance({
      address: "string",
      assetID: "string",
    });
    expect(res).toBeDefined();
  });

  test("getBlock", async () => {
    const res = await xChainClient.getBlock({
      blockId: "string",
      encoding: "hex",
    });
    expect(res).toBeDefined();
  });

  test("getBlockByHeight", async () => {
    const res = await xChainClient.getBlockByHeight({
      height: 1,
      encoding: "hex",
    });
    expect(res).toBeDefined();
  });

  test("getHeight", async () => {
    const res = await xChainClient.getHeight();
    expect(res).toBeDefined();
  });

  test("getTx", async () => {
    const res = await xChainClient.getTx({
      txID: "string",
      encoding: "hex",
    });
    expect(res).toBeDefined();
  });

  test("getTxFee", async () => {
    const res = await xChainClient.getTxFee();
    expect(res).toBeDefined();
  });

  test("getTxStatus", async () => {
    const res = await xChainClient.getTxStatus({
      txID: "string",
    });
    expect(res).toBeDefined();
  });

  test("getUTXOs", async () => {
    const res = await xChainClient.getUTXOs({
      addresses: ["string"],
    });
    expect(res).toBeDefined();
  });

  test("issueTx", async () => {
    const res = await xChainClient.issueTx({
      tx: "string",
      encoding: "hex",
    });
    expect(res).toBeDefined();
  });
});
