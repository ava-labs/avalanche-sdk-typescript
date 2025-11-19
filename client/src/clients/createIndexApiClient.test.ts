import type { EIP1193RequestFn } from "viem";
import { assertType, describe, expect, test, vi } from "vitest";
import { avalanche } from "../chains/index.js";
import type { IndexRpcSchema } from "../methods/index/indexRpcSchema.js";
import { SDK_METADATA } from "./common.js";
import type { IndexApiClient } from "./createIndexApiClient.js";
import { createIndexApiClient } from "./createIndexApiClient.js";

const mockTransport = () => ({
  type: "custom" as const,
  provider: {
    request: vi.fn(async () => null) as any,
  },
});

test("creates", () => {
  const { uid, ...client } = createIndexApiClient({
    chain: avalanche,
    transport: mockTransport(),
    clientType: "indexPChainBlock",
  });

  assertType<EIP1193RequestFn<IndexRpcSchema>>(client.request);

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
      "getContainerByID": [Function],
      "getContainerByIndex": [Function],
      "getContainerRange": [Function],
      "getIndex": [Function],
      "getLastAccepted": [Function],
      "isAccepted": [Function],
      "key": "index",
      "name": "Index API Client",
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
        "url": "https://api.avax.network/ext/index/P/block",
      },
      "type": "avalancheClient",
    }
  `);
});

test("args: key", () => {
  expect(
    createIndexApiClient({
      chain: avalanche,
      key: "customIndex",
      transport: mockTransport(),
      clientType: "indexPChainBlock",
    }).key
  ).toBe("customIndex");
});

test("args: name", () => {
  expect(
    createIndexApiClient({
      chain: avalanche,
      name: "Custom Index Client",
      transport: mockTransport(),
      clientType: "indexPChainBlock",
    }).name
  ).toBe("Custom Index Client");
});

test("args: chain", () => {
  const client = createIndexApiClient({
    chain: avalanche,
    transport: mockTransport(),
    clientType: "indexPChainBlock",
  });

  expect(client.chain).toBe(avalanche);
  expect(client.chain?.id).toBe(43114);
  expect(client.chain?.name).toBe("Avalanche");
});

test("args: chain (undefined)", () => {
  const client = createIndexApiClient({
    transport: {
      type: "http",
      url: "https://api.avax.network/ext/index/P/block",
    },
    clientType: "indexPChainBlock",
  });

  expect(client.chain).toBeUndefined();
});

test("args: clientType", () => {
  const pChainClient = createIndexApiClient({
    chain: avalanche,
    transport: mockTransport(),
    clientType: "indexPChainBlock",
  });
  expect(pChainClient.transport.url).toBe(
    "https://api.avax.network/ext/index/P/block"
  );

  const cChainClient = createIndexApiClient({
    chain: avalanche,
    transport: mockTransport(),
    clientType: "indexCChainBlock",
  });
  expect(cChainClient.transport.url).toBe(
    "https://api.avax.network/ext/index/C/block"
  );

  const xChainBlockClient = createIndexApiClient({
    chain: avalanche,
    transport: mockTransport(),
    clientType: "indexXChainBlock",
  });
  expect(xChainBlockClient.transport.url).toBe(
    "https://api.avax.network/ext/index/X/block"
  );

  const xChainTxClient = createIndexApiClient({
    chain: avalanche,
    transport: mockTransport(),
    clientType: "indexXChainTx",
  });
  expect(xChainTxClient.transport.url).toBe(
    "https://api.avax.network/ext/index/X/tx"
  );
});

describe("transports", () => {
  test("http", () => {
    const { uid, ...client } = createIndexApiClient({
      chain: avalanche,
      transport: {
        type: "http",
        url: "https://api.avax.network/ext/index/P/block",
      },
      clientType: "indexPChainBlock",
    });

    expect(uid).toBeDefined();
    expect(client.transport.type).toBe("http");
    expect(client.key).toBe("index");
    expect(client.name).toBe("Index API Client");
  });

  test("custom (converted to http for index client)", () => {
    const { uid, ...client } = createIndexApiClient({
      chain: avalanche,
      transport: mockTransport(),
      clientType: "indexPChainBlock",
    });

    expect(uid).toBeDefined();
    // Custom transport is converted to HTTP for non-wallet clients
    expect(client.transport.type).toBe("http");
    expect(client.key).toBe("index");
    expect(client.name).toBe("Index API Client");
  });
});

test("extend", () => {
  const { uid: _, ...client } = createIndexApiClient({
    chain: avalanche,
    transport: mockTransport(),
    clientType: "indexPChainBlock",
  });

  expect(client).toHaveProperty("extend");
  expect(typeof client.extend).toBe("function");

  // Test that extend returns a client with the same structure
  const extended = client.extend(() => ({}));
  expect(extended).toHaveProperty("getContainerByID");
  expect(extended).toHaveProperty("extend");
});

test("Index API methods are available", () => {
  const client = createIndexApiClient({
    chain: avalanche,
    transport: mockTransport(),
    clientType: "indexPChainBlock",
  });

  // Verify all Index API methods are present
  expect(client).toHaveProperty("getContainerByID");
  expect(client).toHaveProperty("getContainerByIndex");
  expect(client).toHaveProperty("getContainerRange");
  expect(client).toHaveProperty("getIndex");
  expect(client).toHaveProperty("getLastAccepted");
  expect(client).toHaveProperty("isAccepted");

  // Verify they are functions
  expect(typeof client.getContainerByID).toBe("function");
  expect(typeof client.getContainerByIndex).toBe("function");
  expect(typeof client.getContainerRange).toBe("function");
  expect(typeof client.getIndex).toBe("function");
  expect(typeof client.getLastAccepted).toBe("function");
  expect(typeof client.isAccepted).toBe("function");
});

describe("type tests", () => {
  test("IndexApiClient type", () => {
    const client = createIndexApiClient({
      chain: avalanche,
      transport: mockTransport(),
      clientType: "indexPChainBlock",
    });

    assertType<IndexApiClient>(client);
    assertType<typeof client.getContainerByID>(client.getContainerByID);
    assertType<typeof client.getContainerByIndex>(client.getContainerByIndex);
    assertType<typeof client.getContainerRange>(client.getContainerRange);
    assertType<typeof client.getIndex>(client.getIndex);
    assertType<typeof client.getLastAccepted>(client.getLastAccepted);
    assertType<typeof client.isAccepted>(client.isAccepted);
  });
});
