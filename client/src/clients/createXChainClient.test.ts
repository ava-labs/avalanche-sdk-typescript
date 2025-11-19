import type { EIP1193RequestFn } from "viem";
import { assertType, describe, expect, test, vi } from "vitest";
import { avalanche } from "../chains/index.js";
import type { XChainRpcSchema } from "../methods/xChain/xChainRpcSchema.js";
import { SDK_METADATA } from "./common.js";
import type { XChainClient } from "./createXChainClient.js";
import { createXChainClient } from "./createXChainClient.js";

const mockTransport = () => ({
  type: "custom" as const,
  provider: {
    request: vi.fn(async () => null) as any,
  },
});

test("creates", () => {
  const { uid, ...client } = createXChainClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  assertType<EIP1193RequestFn<XChainRpcSchema>>(client.request);

  expect(uid).toBeDefined();
  expect(client).toMatchInlineSnapshot(`
    {
      "account": undefined,
      "batch": undefined,
      "buildGenesis": [Function],
      "cacheTime": 4000,
      "ccipRead": undefined,
      "chain": {
        "blockExplorers": {
          "default": {
            "apiUrl": "https://api.avax.network",
            "name": "Avalanche Explorer",
            "url": "https://subnets.avax.network",
          },
        },
        "contracts": {
          "multicall3": {
            "address": "0xca11bde05977b3631167028862be2a173976ca11",
            "blockCreated": 11907934,
          },
          "teleporterMessenger": {
            "address": "0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf",
          },
          "teleporterRegistry": {
            "address": "0x7C43605E14F391720e1b37E49C78C4b03A488d98",
          },
        },
        "fees": undefined,
        "formatters": undefined,
        "id": 43114,
        "name": "Avalanche",
        "nativeCurrency": {
          "decimals": 18,
          "name": "Avalanche",
          "symbol": "AVAX",
        },
        "rpcUrls": {
          "default": {
            "http": [
              "https://api.avax.network/ext/bc/C/rpc",
            ],
          },
        },
        "serializers": undefined,
      },
      "extend": [Function],
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
      "key": "xChain",
      "name": "X-Chain Client",
      "pollingInterval": 4000,
      "request": [Function],
      "transport": {
        "fetchOptions": {
          "headers": {
            "Content-Type": "application/json",
            "User-Agent": "@avalanche-sdk/client ${SDK_METADATA.version}",
          },
        },
        "key": "http",
        "methods": undefined,
        "name": "HTTP JSON-RPC",
        "request": [Function],
        "retryCount": 3,
        "retryDelay": 150,
        "timeout": 10000,
        "type": "http",
        "url": "https://api.avax.network/ext/bc/X",
      },
      "type": "avalancheClient",
    }
  `);
});

test("args: key", () => {
  expect(
    createXChainClient({
      chain: avalanche,
      key: "customXChain",
      transport: mockTransport(),
    }).key
  ).toBe("customXChain");
});

test("args: name", () => {
  expect(
    createXChainClient({
      chain: avalanche,
      name: "Custom X-Chain Client",
      transport: mockTransport(),
    }).name
  ).toBe("Custom X-Chain Client");
});

test("args: chain", () => {
  const client = createXChainClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  expect(client.chain).toBe(avalanche);
  expect(client.chain?.id).toBe(43114);
  expect(client.chain?.name).toBe("Avalanche");
});

test("args: chain (undefined)", () => {
  const client = createXChainClient({
    transport: {
      type: "http",
      url: "https://api.avax.network/ext/bc/X",
    },
  });

  expect(client.chain).toBeUndefined();
});

describe("transports", () => {
  test("http", () => {
    const { uid, ...client } = createXChainClient({
      chain: avalanche,
      transport: {
        type: "http",
        url: "https://api.avax.network/ext/bc/X",
      },
    });

    expect(uid).toBeDefined();
    expect(client.transport.type).toBe("http");
    expect(client.key).toBe("xChain");
    expect(client.name).toBe("X-Chain Client");
  });

  test("custom (converted to http for x-chain client)", () => {
    const { uid, ...client } = createXChainClient({
      chain: avalanche,
      transport: mockTransport(),
    });

    expect(uid).toBeDefined();
    // Custom transport is converted to HTTP for non-wallet clients
    expect(client.transport.type).toBe("http");
    expect(client.key).toBe("xChain");
    expect(client.name).toBe("X-Chain Client");
  });
});

test("extend", () => {
  const { uid: _, ...client } = createXChainClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  expect(client).toHaveProperty("extend");
  expect(typeof client.extend).toBe("function");

  // Test that extend returns a client with the same structure
  const extended = client.extend(() => ({}));
  expect(extended).toHaveProperty("getBalance");
  expect(extended).toHaveProperty("extend");
});

test("X-Chain API methods are available", () => {
  const client = createXChainClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  // Verify all X-Chain API methods are present
  expect(client).toHaveProperty("buildGenesis");
  expect(client).toHaveProperty("getAllBalances");
  expect(client).toHaveProperty("getAssetDescription");
  expect(client).toHaveProperty("getBalance");
  expect(client).toHaveProperty("getBlock");
  expect(client).toHaveProperty("getBlockByHeight");
  expect(client).toHaveProperty("getHeight");
  expect(client).toHaveProperty("getTx");
  expect(client).toHaveProperty("getTxFee");
  expect(client).toHaveProperty("getTxStatus");
  expect(client).toHaveProperty("getUTXOs");
  expect(client).toHaveProperty("issueTx");

  // Verify they are functions
  expect(typeof client.buildGenesis).toBe("function");
  expect(typeof client.getAllBalances).toBe("function");
  expect(typeof client.getAssetDescription).toBe("function");
  expect(typeof client.getBalance).toBe("function");
  expect(typeof client.getBlock).toBe("function");
  expect(typeof client.getBlockByHeight).toBe("function");
  expect(typeof client.getHeight).toBe("function");
  expect(typeof client.getTx).toBe("function");
  expect(typeof client.getTxFee).toBe("function");
  expect(typeof client.getTxStatus).toBe("function");
  expect(typeof client.getUTXOs).toBe("function");
  expect(typeof client.issueTx).toBe("function");
});

describe("type tests", () => {
  test("XChainClient type", () => {
    const client = createXChainClient({
      chain: avalanche,
      transport: mockTransport(),
    });

    assertType<XChainClient>(client);
    assertType<typeof client.buildGenesis>(client.buildGenesis);
    assertType<typeof client.getAllBalances>(client.getAllBalances);
    assertType<typeof client.getAssetDescription>(client.getAssetDescription);
    assertType<typeof client.getBalance>(client.getBalance);
    assertType<typeof client.getBlock>(client.getBlock);
    assertType<typeof client.getBlockByHeight>(client.getBlockByHeight);
    assertType<typeof client.getHeight>(client.getHeight);
    assertType<typeof client.getTx>(client.getTx);
    assertType<typeof client.getTxFee>(client.getTxFee);
    assertType<typeof client.getTxStatus>(client.getTxStatus);
    assertType<typeof client.getUTXOs>(client.getUTXOs);
    assertType<typeof client.issueTx>(client.issueTx);
  });
});
