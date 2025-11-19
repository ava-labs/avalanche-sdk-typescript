import type { EIP1193RequestFn } from "viem";
import { assertType, describe, expect, test, vi } from "vitest";
import { avalanche } from "../chains/index.js";
import type { AdminRpcSchema } from "../methods/admin/adminRpcSchema.js";
import { SDK_METADATA } from "./common.js";
import type { AdminApiClient } from "./createAdminApiClient.js";
import { createAdminApiClient } from "./createAdminApiClient.js";

const mockTransport = () => ({
  type: "custom" as const,
  provider: {
    request: vi.fn(async () => null) as any,
  },
});

test("creates", () => {
  const { uid, ...client } = createAdminApiClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  assertType<EIP1193RequestFn<AdminRpcSchema>>(client.request);

  expect(uid).toBeDefined();
  expect(client).toMatchInlineSnapshot(`
    {
      "account": undefined,
      "alias": [Function],
      "aliasChain": [Function],
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
      "getChainAliases": [Function],
      "getLoggerLevel": [Function],
      "key": "admin",
      "loadVMs": [Function],
      "lockProfile": [Function],
      "memoryProfile": [Function],
      "name": "Admin API Client",
      "pollingInterval": 4000,
      "request": [Function],
      "setLoggerLevel": [Function],
      "startCPUProfiler": [Function],
      "stopCPUProfiler": [Function],
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
        "url": "https://api.avax.network/ext/admin",
      },
      "type": "avalancheClient",
    }
  `);
});

test("args: key", () => {
  expect(
    createAdminApiClient({
      chain: avalanche,
      key: "customAdmin",
      transport: mockTransport(),
    }).key
  ).toBe("customAdmin");
});

test("args: name", () => {
  expect(
    createAdminApiClient({
      chain: avalanche,
      name: "Custom Admin Client",
      transport: mockTransport(),
    }).name
  ).toBe("Custom Admin Client");
});

test("args: chain", () => {
  const client = createAdminApiClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  expect(client.chain).toBe(avalanche);
  expect(client.chain?.id).toBe(43114);
  expect(client.chain?.name).toBe("Avalanche");
});

test("args: chain (undefined)", () => {
  const client = createAdminApiClient({
    transport: {
      type: "http",
      url: "https://api.avax.network/ext/admin",
    },
  });

  expect(client.chain).toBeUndefined();
});

describe("transports", () => {
  test("http", () => {
    const { uid, ...client } = createAdminApiClient({
      chain: avalanche,
      transport: {
        type: "http",
        url: "https://api.avax.network/ext/admin",
      },
    });

    expect(uid).toBeDefined();
    expect(client.transport.type).toBe("http");
    expect(client.key).toBe("admin");
    expect(client.name).toBe("Admin API Client");
  });

  test("custom (converted to http for admin client)", () => {
    const { uid, ...client } = createAdminApiClient({
      chain: avalanche,
      transport: mockTransport(),
    });

    expect(uid).toBeDefined();
    // Custom transport is converted to HTTP for non-wallet clients
    expect(client.transport.type).toBe("http");
    expect(client.key).toBe("admin");
    expect(client.name).toBe("Admin API Client");
  });
});

test("extend", () => {
  const { uid: _, ...client } = createAdminApiClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  expect(client).toHaveProperty("extend");
  expect(typeof client.extend).toBe("function");

  // Test that extend returns a client with the same structure
  const extended = client.extend(() => ({}));
  expect(extended).toHaveProperty("alias");
  expect(extended).toHaveProperty("extend");
});

test("admin API methods are available", () => {
  const client = createAdminApiClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  // Verify all admin API methods are present
  expect(client).toHaveProperty("alias");
  expect(client).toHaveProperty("aliasChain");
  expect(client).toHaveProperty("getChainAliases");
  expect(client).toHaveProperty("getLoggerLevel");
  expect(client).toHaveProperty("loadVMs");
  expect(client).toHaveProperty("lockProfile");
  expect(client).toHaveProperty("memoryProfile");
  expect(client).toHaveProperty("setLoggerLevel");
  expect(client).toHaveProperty("startCPUProfiler");
  expect(client).toHaveProperty("stopCPUProfiler");

  // Verify they are functions
  expect(typeof client.alias).toBe("function");
  expect(typeof client.aliasChain).toBe("function");
  expect(typeof client.getChainAliases).toBe("function");
  expect(typeof client.getLoggerLevel).toBe("function");
  expect(typeof client.loadVMs).toBe("function");
  expect(typeof client.lockProfile).toBe("function");
  expect(typeof client.memoryProfile).toBe("function");
  expect(typeof client.setLoggerLevel).toBe("function");
  expect(typeof client.startCPUProfiler).toBe("function");
  expect(typeof client.stopCPUProfiler).toBe("function");
});

describe("type tests", () => {
  test("AdminApiClient type", () => {
    const client = createAdminApiClient({
      chain: avalanche,
      transport: mockTransport(),
    });

    assertType<AdminApiClient>(client);
    assertType<typeof client.alias>(client.alias);
    assertType<typeof client.aliasChain>(client.aliasChain);
    assertType<typeof client.getChainAliases>(client.getChainAliases);
    assertType<typeof client.getLoggerLevel>(client.getLoggerLevel);
    assertType<typeof client.loadVMs>(client.loadVMs);
    assertType<typeof client.lockProfile>(client.lockProfile);
    assertType<typeof client.memoryProfile>(client.memoryProfile);
    assertType<typeof client.setLoggerLevel>(client.setLoggerLevel);
    assertType<typeof client.startCPUProfiler>(client.startCPUProfiler);
    assertType<typeof client.stopCPUProfiler>(client.stopCPUProfiler);
  });
});
