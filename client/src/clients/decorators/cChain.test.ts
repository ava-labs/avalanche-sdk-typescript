import { createTransport, EIP1193RequestFn } from "viem";
import { describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../createAvalancheBaseClient.js";
import { cChainActions } from "./cChain.js";

const mockTransport = () =>
  createTransport({
    key: "mock",
    name: "Mock Transport",
    request: vi.fn(async ({ method }) => {
      switch (method) {
        case "avax.getAtomicTx":
          return {
            tx: "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
            blockHeight: "12345",
            encoding: "hex",
          };
        case "avax.getAtomicTxStatus":
          return {
            status: "Accepted",
            blockHeight: "12345",
          };
        case "avax.getUTXOs":
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
        case "platform.issueTx":
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

const cChainClient = cChainActions(client);

test("default", async () => {
  expect(cChainClient).toMatchInlineSnapshot(`{
  "getAtomicTx": [Function],
  "getAtomicTxStatus": [Function],
  "getUTXOs": [Function],
  "issueTx": [Function],
}`);
});

describe("smoke test", () => {
  test("getAtomicTx", async () => {
    const res = await cChainClient.getAtomicTx({
      txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
    });
    expect(res).toBeDefined();
  });

  test("getAtomicTxStatus", async () => {
    const res = await cChainClient.getAtomicTxStatus({
      txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
    });
    expect(res).toBeDefined();
  });

  test("getUTXOs", async () => {
    const res = await cChainClient.getUTXOs({
      addresses: ["X-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
    });
    expect(res).toBeDefined();
  });

  test("getUTXOs with limit", async () => {
    const res = await cChainClient.getUTXOs({
      addresses: ["X-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
      limit: 100,
    });
    expect(res).toBeDefined();
  });

  test("getUTXOs with startIndex", async () => {
    const res = await cChainClient.getUTXOs({
      addresses: ["X-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
      startIndex: {
        address: "X-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy",
        utxo: "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
      },
    });
    expect(res).toBeDefined();
  });

  test("getUTXOs with sourceChain", async () => {
    const res = await cChainClient.getUTXOs({
      addresses: ["X-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
      sourceChain: "X",
    });
    expect(res).toBeDefined();
  });

  test("getUTXOs with encoding", async () => {
    const res = await cChainClient.getUTXOs({
      addresses: ["X-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
      encoding: "hex",
    });
    expect(res).toBeDefined();
  });

  test("issueTx", async () => {
    const res = await cChainClient.issueTx({
      tx: "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
      encoding: "hex",
    });
    expect(res).toBeDefined();
  });
});
