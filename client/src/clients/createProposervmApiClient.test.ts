import type { EIP1193RequestFn } from "viem";
import { assertType, describe, expect, test, vi } from "vitest";
import { avalanche } from "../chains/index.js";
import type { ProposervmRpcSchema } from "../methods/proposervm/proposervmRpcSchema.js";
import { SDK_METADATA } from "./common.js";
import type { ProposervmApiClient } from "./createProposervmApiClient.js";
import { createProposervmApiClient } from "./createProposervmApiClient.js";

const mockTransport = () => ({
  type: "custom" as const,
  provider: {
    request: vi.fn(async () => null) as any,
  },
});

test("creates", () => {
  const { uid, ...client } = createProposervmApiClient({
    chain: avalanche,
    transport: mockTransport(),
    clientType: "proposervmCChain",
  });

  assertType<EIP1193RequestFn<ProposervmRpcSchema>>(client.request);

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
      "getCurrentEpoch": [Function],
      "getProposedHeight": [Function],
      "key": "proposervm",
      "name": "proposervm API Client",
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
        "url": "https://api.avax.network/ext/bc/C/proposervm",
      },
      "type": "avalancheClient",
    }
  `);
});

test("args: key", () => {
  expect(
    createProposervmApiClient({
      chain: avalanche,
      key: "customProposervm",
      transport: mockTransport(),
      clientType: "proposervmCChain",
    }).key
  ).toBe("customProposervm");
});

test("args: name", () => {
  expect(
    createProposervmApiClient({
      chain: avalanche,
      name: "Custom Proposervm Client",
      transport: mockTransport(),
      clientType: "proposervmCChain",
    }).name
  ).toBe("Custom Proposervm Client");
});

test("args: chain", () => {
  const client = createProposervmApiClient({
    chain: avalanche,
    transport: mockTransport(),
    clientType: "proposervmCChain",
  });

  expect(client.chain).toBe(avalanche);
  expect(client.chain?.id).toBe(43114);
  expect(client.chain?.name).toBe("Avalanche");
});

test("args: chain (undefined)", () => {
  const client = createProposervmApiClient({
    transport: {
      type: "http",
      url: "https://api.avax.network/ext/bc/C/proposervm",
    },
    clientType: "proposervmCChain",
  });

  expect(client.chain).toBeUndefined();
});

test("args: clientType", () => {
  const cChainClient = createProposervmApiClient({
    chain: avalanche,
    transport: mockTransport(),
    clientType: "proposervmCChain",
  });
  expect(cChainClient.transport.url).toBe(
    "https://api.avax.network/ext/bc/C/proposervm"
  );

  const pChainClient = createProposervmApiClient({
    chain: avalanche,
    transport: mockTransport(),
    clientType: "proposervmPChain",
  });
  expect(pChainClient.transport.url).toBe(
    "https://api.avax.network/ext/bc/P/proposervm"
  );

  const xChainClient = createProposervmApiClient({
    chain: avalanche,
    transport: mockTransport(),
    clientType: "proposervmXChain",
  });
  expect(xChainClient.transport.url).toBe(
    "https://api.avax.network/ext/bc/X/proposervm"
  );
});

describe("transports", () => {
  test("http", () => {
    const { uid, ...client } = createProposervmApiClient({
      chain: avalanche,
      transport: {
        type: "http",
        url: "https://api.avax.network/ext/bc/C/proposervm",
      },
      clientType: "proposervmCChain",
    });

    expect(uid).toBeDefined();
    expect(client.transport.type).toBe("http");
    expect(client.key).toBe("proposervm");
    expect(client.name).toBe("proposervm API Client");
  });

  test("custom (converted to http for proposervm client)", () => {
    const { uid, ...client } = createProposervmApiClient({
      chain: avalanche,
      transport: mockTransport(),
      clientType: "proposervmCChain",
    });

    expect(uid).toBeDefined();
    // Custom transport is converted to HTTP for non-wallet clients
    expect(client.transport.type).toBe("http");
    expect(client.key).toBe("proposervm");
    expect(client.name).toBe("proposervm API Client");
  });
});

test("extend", () => {
  const { uid: _, ...client } = createProposervmApiClient({
    chain: avalanche,
    transport: mockTransport(),
    clientType: "proposervmCChain",
  });

  expect(client).toHaveProperty("extend");
  expect(typeof client.extend).toBe("function");

  // Test that extend returns a client with the same structure
  const extended = client.extend(() => ({}));
  expect(extended).toHaveProperty("getProposedHeight");
  expect(extended).toHaveProperty("extend");
});

test("Proposervm API methods are available", () => {
  const client = createProposervmApiClient({
    chain: avalanche,
    transport: mockTransport(),
    clientType: "proposervmCChain",
  });

  // Verify all Proposervm API methods are present
  expect(client).toHaveProperty("getProposedHeight");
  expect(client).toHaveProperty("getCurrentEpoch");

  // Verify they are functions
  expect(typeof client.getProposedHeight).toBe("function");
  expect(typeof client.getCurrentEpoch).toBe("function");
});

describe("type tests", () => {
  test("ProposervmApiClient type", () => {
    const client = createProposervmApiClient({
      chain: avalanche,
      transport: mockTransport(),
      clientType: "proposervmCChain",
    });

    assertType<ProposervmApiClient>(client);
    assertType<typeof client.getProposedHeight>(client.getProposedHeight);
    assertType<typeof client.getCurrentEpoch>(client.getCurrentEpoch);
  });
});
