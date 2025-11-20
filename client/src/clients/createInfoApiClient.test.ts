import type { EIP1193RequestFn } from "viem";
import { assertType, describe, expect, test, vi } from "vitest";
import { avalanche } from "../chains/index.js";
import type { InfoRpcSchema } from "../methods/info/infoRpcSchema.js";
import { SDK_METADATA } from "./common.js";
import type { InfoApiClient } from "./createInfoApiClient.js";
import { createInfoApiClient } from "./createInfoApiClient.js";

const mockTransport = () => ({
  type: "custom" as const,
  provider: {
    request: vi.fn(async () => null) as any,
  },
});

test("creates", () => {
  const { uid, ...client } = createInfoApiClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  assertType<EIP1193RequestFn<InfoRpcSchema>>(client.request);

  expect(uid).toBeDefined();
  expect(client).toMatchInlineSnapshot(`
    {
      "account": undefined,
      "acps": [Function],
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
      "getBlockchainID": [Function],
      "getNetworkID": [Function],
      "getNetworkName": [Function],
      "getNodeID": [Function],
      "getNodeIP": [Function],
      "getNodeVersion": [Function],
      "getTxFee": [Function],
      "getVMs": [Function],
      "isBootstrapped": [Function],
      "key": "info",
      "name": "Info API Client",
      "peers": [Function],
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
        "url": "https://api.avax.network/ext/info",
      },
      "type": "avalancheClient",
      "upgrades": [Function],
      "uptime": [Function],
    }
  `);
});

test("args: key", () => {
  expect(
    createInfoApiClient({
      chain: avalanche,
      key: "customInfo",
      transport: mockTransport(),
    }).key
  ).toBe("customInfo");
});

test("args: name", () => {
  expect(
    createInfoApiClient({
      chain: avalanche,
      name: "Custom Info Client",
      transport: mockTransport(),
    }).name
  ).toBe("Custom Info Client");
});

test("args: chain", () => {
  const client = createInfoApiClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  expect(client.chain).toBe(avalanche);
  expect(client.chain?.id).toBe(43114);
  expect(client.chain?.name).toBe("Avalanche");
});

test("args: chain (undefined)", () => {
  const client = createInfoApiClient({
    transport: {
      type: "http",
      url: "https://api.avax.network/ext/info",
    },
  });

  expect(client.chain).toBeUndefined();
});

describe("transports", () => {
  test("http", () => {
    const { uid, ...client } = createInfoApiClient({
      chain: avalanche,
      transport: {
        type: "http",
        url: "https://api.avax.network/ext/info",
      },
    });

    expect(uid).toBeDefined();
    expect(client.transport.type).toBe("http");
    expect(client.key).toBe("info");
    expect(client.name).toBe("Info API Client");
  });

  test("custom (converted to http for info client)", () => {
    const { uid, ...client } = createInfoApiClient({
      chain: avalanche,
      transport: mockTransport(),
    });

    expect(uid).toBeDefined();
    // Custom transport is converted to HTTP for non-wallet clients
    expect(client.transport.type).toBe("http");
    expect(client.key).toBe("info");
    expect(client.name).toBe("Info API Client");
  });
});

test("extend", () => {
  const { uid: _, ...client } = createInfoApiClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  expect(client).toHaveProperty("extend");
  expect(typeof client.extend).toBe("function");

  // Test that extend returns a client with the same structure
  const extended = client.extend(() => ({}));
  expect(extended).toHaveProperty("acps");
  expect(extended).toHaveProperty("extend");
});

test("Info API methods are available", () => {
  const client = createInfoApiClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  // Verify all Info API methods are present
  expect(client).toHaveProperty("acps");
  expect(client).toHaveProperty("getBlockchainID");
  expect(client).toHaveProperty("getNetworkID");
  expect(client).toHaveProperty("getNetworkName");
  expect(client).toHaveProperty("getNodeID");
  expect(client).toHaveProperty("getNodeIP");
  expect(client).toHaveProperty("getNodeVersion");
  expect(client).toHaveProperty("getTxFee");
  expect(client).toHaveProperty("getVMs");
  expect(client).toHaveProperty("isBootstrapped");
  expect(client).toHaveProperty("peers");
  expect(client).toHaveProperty("upgrades");
  expect(client).toHaveProperty("uptime");

  // Verify they are functions
  expect(typeof client.acps).toBe("function");
  expect(typeof client.getBlockchainID).toBe("function");
  expect(typeof client.getNetworkID).toBe("function");
  expect(typeof client.getNetworkName).toBe("function");
  expect(typeof client.getNodeID).toBe("function");
  expect(typeof client.getNodeIP).toBe("function");
  expect(typeof client.getNodeVersion).toBe("function");
  expect(typeof client.getTxFee).toBe("function");
  expect(typeof client.getVMs).toBe("function");
  expect(typeof client.isBootstrapped).toBe("function");
  expect(typeof client.peers).toBe("function");
  expect(typeof client.upgrades).toBe("function");
  expect(typeof client.uptime).toBe("function");
});

describe("type tests", () => {
  test("InfoApiClient type", () => {
    const client = createInfoApiClient({
      chain: avalanche,
      transport: mockTransport(),
    });

    assertType<InfoApiClient>(client);
    assertType<typeof client.acps>(client.acps);
    assertType<typeof client.getBlockchainID>(client.getBlockchainID);
    assertType<typeof client.getNetworkID>(client.getNetworkID);
    assertType<typeof client.getNetworkName>(client.getNetworkName);
    assertType<typeof client.getNodeID>(client.getNodeID);
    assertType<typeof client.getNodeIP>(client.getNodeIP);
    assertType<typeof client.getNodeVersion>(client.getNodeVersion);
    assertType<typeof client.getTxFee>(client.getTxFee);
    assertType<typeof client.getVMs>(client.getVMs);
    assertType<typeof client.isBootstrapped>(client.isBootstrapped);
    assertType<typeof client.peers>(client.peers);
    assertType<typeof client.upgrades>(client.upgrades);
    assertType<typeof client.uptime>(client.uptime);
  });
});
