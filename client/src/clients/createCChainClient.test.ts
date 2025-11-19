import type { EIP1193RequestFn } from "viem";
import { assertType, describe, expect, test, vi } from "vitest";
import { avalanche } from "../chains/index.js";
import type { CChainRpcSchema } from "../methods/cChain/cChainRpcSchema.js";
import { SDK_METADATA } from "./common.js";
import type { CChainClient } from "./createCChainClient.js";
import { createCChainClient } from "./createCChainClient.js";

const mockTransport = () => ({
  type: "custom" as const,
  provider: {
    request: vi.fn(async () => null) as any,
  },
});

test("creates", () => {
  const { uid, ...client } = createCChainClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  assertType<EIP1193RequestFn<CChainRpcSchema>>(client.request);

  expect(uid).toBeDefined();
  expect(client).toMatchInlineSnapshot(`
    {
      "account": undefined,
      "batch": undefined,
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
      "getAtomicTx": [Function],
      "getAtomicTxStatus": [Function],
      "getUTXOs": [Function],
      "issueTx": [Function],
      "key": "cChain",
      "name": "C-Chain Client",
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
        "url": "https://api.avax.network/ext/bc/C/avax",
      },
      "type": "avalancheClient",
    }
  `);
});

test("args: key", () => {
  expect(
    createCChainClient({
      chain: avalanche,
      key: "customCChain",
      transport: mockTransport(),
    }).key
  ).toBe("customCChain");
});

test("args: name", () => {
  expect(
    createCChainClient({
      chain: avalanche,
      name: "Custom C-Chain Client",
      transport: mockTransport(),
    }).name
  ).toBe("Custom C-Chain Client");
});

test("args: chain", () => {
  const client = createCChainClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  expect(client.chain).toBe(avalanche);
  expect(client.chain?.id).toBe(43114);
  expect(client.chain?.name).toBe("Avalanche");
});

test("args: chain (undefined)", () => {
  const client = createCChainClient({
    transport: {
      type: "http",
      url: "https://api.avax.network/ext/bc/C/avax",
    },
  });

  expect(client.chain).toBeUndefined();
});

describe("transports", () => {
  test("http", () => {
    const { uid, ...client } = createCChainClient({
      chain: avalanche,
      transport: {
        type: "http",
        url: "https://api.avax.network/ext/bc/C/avax",
      },
    });

    expect(uid).toBeDefined();
    expect(client.transport.type).toBe("http");
    expect(client.key).toBe("cChain");
    expect(client.name).toBe("C-Chain Client");
  });

  test("custom (converted to http for c-chain client)", () => {
    const { uid, ...client } = createCChainClient({
      chain: avalanche,
      transport: mockTransport(),
    });

    expect(uid).toBeDefined();
    // Custom transport is converted to HTTP for non-wallet clients
    expect(client.transport.type).toBe("http");
    expect(client.key).toBe("cChain");
    expect(client.name).toBe("C-Chain Client");
  });
});

test("extend", () => {
  const { uid: _, ...client } = createCChainClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  expect(client).toHaveProperty("extend");
  expect(typeof client.extend).toBe("function");

  // Test that extend returns a client with the same structure
  const extended = client.extend(() => ({}));
  expect(extended).toHaveProperty("getAtomicTx");
  expect(extended).toHaveProperty("extend");
});

test("C-Chain API methods are available", () => {
  const client = createCChainClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  // Verify all C-Chain API methods are present
  expect(client).toHaveProperty("getAtomicTx");
  expect(client).toHaveProperty("getAtomicTxStatus");
  expect(client).toHaveProperty("getUTXOs");
  expect(client).toHaveProperty("issueTx");

  // Verify they are functions
  expect(typeof client.getAtomicTx).toBe("function");
  expect(typeof client.getAtomicTxStatus).toBe("function");
  expect(typeof client.getUTXOs).toBe("function");
  expect(typeof client.issueTx).toBe("function");
});

describe("type tests", () => {
  test("CChainClient type", () => {
    const client = createCChainClient({
      chain: avalanche,
      transport: mockTransport(),
    });

    assertType<CChainClient>(client);
    assertType<typeof client.getAtomicTx>(client.getAtomicTx);
    assertType<typeof client.getAtomicTxStatus>(client.getAtomicTxStatus);
    assertType<typeof client.getUTXOs>(client.getUTXOs);
    assertType<typeof client.issueTx>(client.issueTx);
  });
});
