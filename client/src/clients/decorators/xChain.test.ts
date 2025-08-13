import { createTransport, EIP1193RequestFn } from "viem";
import { describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../createAvalancheBaseClient.js";
import { xChainActions } from "./xChain.js";

const mockTransport = () =>
  createTransport({
    key: "mock",
    name: "Mock Transport",
    request: vi.fn(async ({ method }) => {
      switch (method) {
        case "avm.buildGenesis":
          return {
            bytes:
              "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
          };
        case "avm.getAllBalances":
          return {
            balances: [
              {
                assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
                balance: 1000000000n,
              },
              {
                assetID: "2fombhL7aGPwj3KH4bfrmJHoWsmN8GsT1s3M4Go1YxkBw9j4Z",
                balance: 500000000n,
              },
            ],
          };
        case "avm.getAssetDescription":
          return {
            assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
            name: "Avalanche",
            symbol: "AVAX",
            denomination: 9,
          };
        case "avm.getBalance":
          return {
            balance: 1000000000n,
            utxoIDs: [
              {
                txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                outputIndex: 0,
              },
              {
                txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ2",
                outputIndex: 1,
              },
            ],
          };
        case "avm.getBlock":
          return {
            encoding: "hex",
            block:
              "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
          };
        case "avm.getBlockByHeight":
          return {
            encoding: "hex",
            block:
              "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
          };
        case "avm.getHeight":
          return {
            height: 12345,
          };
        case "avm.getTx":
          return {
            encoding: "hex",
            tx: "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
          };
        case "avm.getTxFee":
          return {
            txFee: 1000000n,
            creationTxFee: 10000000n,
          };
        case "avm.getTxStatus":
          return {
            status: "Accepted",
            reason: "Transaction accepted",
          };
        case "avm.getUTXOs":
          return {
            numFetched: 2,
            utxos: [
              "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
              "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186b0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
            ],
            endIndex: {
              address: "X-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy",
              utxo: "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186b0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
            },
          };
        case "avm.issueTx":
          return {
            txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
          };
        // TODO: add proper responses for the rest of the methods
        // The default case is just a placeholder to satisfy the test
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

const client = createAvalancheBaseClient({
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
  test("buildGenesis", async () => {
    const res = await xChainClient.buildGenesis({
      networkID: 16,
      genesisData: {
        name: "myFixedCapAsset",
        symbol: "MFCA",
        denomination: 9,
        initialState: {
          fixedCap: {
            amount: 100000,
            addresses: ["avax13ery2kvdrkd2nkquvs892gl8hg7mq4a6ufnrn6"],
          },
        },
      },
      encoding: "hex",
    });
    expect(res).toBeDefined();
  });

  test("getAllBalances", async () => {
    const res = await xChainClient.getAllBalances({
      addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
    });
    expect(res).toBeDefined();
  });

  test("getAssetDescription", async () => {
    const res = await xChainClient.getAssetDescription({
      assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
    });
    expect(res).toBeDefined();
  });

  test("getBalance", async () => {
    const res = await xChainClient.getBalance({
      address: "X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5",
      assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
    });
    expect(res).toBeDefined();
  });

  test("getBlock", async () => {
    const res = await xChainClient.getBlock({
      blockId: "d7WYmb8VeZNHsny3EJCwMm6QA37s1EHwMxw1Y71V3FqPZ5EFG",
      encoding: "hex",
    });
    expect(res).toBeDefined();
  });

  test("getBlockByHeight", async () => {
    const res = await xChainClient.getBlockByHeight({
      height: 1000001,
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
      txID: "11111111111111111111111111111111LpoYY",
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
      txID: "11111111111111111111111111111111LpoYY",
    });
    expect(res).toBeDefined();
  });

  test("getTxStatus with includeReason", async () => {
    const res = await xChainClient.getTxStatus({
      txID: "11111111111111111111111111111111LpoYY",
      includeReason: true,
    });
    expect(res).toBeDefined();
  });

  test("getUTXOs", async () => {
    const res = await xChainClient.getUTXOs({
      addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
    });
    expect(res).toBeDefined();
  });

  test("getUTXOs with sourceChain", async () => {
    const res = await xChainClient.getUTXOs({
      addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
      sourceChain: "P",
    });
    expect(res).toBeDefined();
  });

  test("getUTXOs with limit", async () => {
    const res = await xChainClient.getUTXOs({
      addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
      limit: 100,
    });
    expect(res).toBeDefined();
  });

  test("getUTXOs with startIndex", async () => {
    const res = await xChainClient.getUTXOs({
      addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
      startIndex: {
        address: "X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5",
        utxo: "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
      },
    });
    expect(res).toBeDefined();
  });

  test("issueTx", async () => {
    const res = await xChainClient.issueTx({
      tx: "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
      encoding: "hex",
    });
    expect(res).toBeDefined();
  });
});
