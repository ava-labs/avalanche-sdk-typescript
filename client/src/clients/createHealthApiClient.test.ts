import type { EIP1193RequestFn } from "viem";
import { assertType, describe, expect, test, vi } from "vitest";
import { avalanche } from "../chains/index.js";
import type { HealthRpcSchema } from "../methods/health/healthRpcSchema.js";
import { SDK_METADATA } from "./common.js";
import type { HealthApiClient } from "./createHealthApiClient.js";
import { createHealthApiClient } from "./createHealthApiClient.js";

const mockTransport = () => ({
  type: "custom" as const,
  provider: {
    request: vi.fn(async () => null) as any,
  },
});

test("creates", () => {
  const { uid, ...client } = createHealthApiClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  assertType<EIP1193RequestFn<HealthRpcSchema>>(client.request);

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
      "health": [Function],
      "key": "health",
      "liveness": [Function],
      "name": "Health API Client",
      "pollingInterval": 4000,
      "readiness": [Function],
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
        "url": "https://api.avax.network/ext/health",
      },
      "type": "avalancheClient",
    }
  `);
});

test("args: key", () => {
  expect(
    createHealthApiClient({
      chain: avalanche,
      key: "customHealth",
      transport: mockTransport(),
    }).key
  ).toBe("customHealth");
});

test("args: name", () => {
  expect(
    createHealthApiClient({
      chain: avalanche,
      name: "Custom Health Client",
      transport: mockTransport(),
    }).name
  ).toBe("Custom Health Client");
});

test("args: chain", () => {
  const client = createHealthApiClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  expect(client.chain).toBe(avalanche);
  expect(client.chain?.id).toBe(43114);
  expect(client.chain?.name).toBe("Avalanche");
});

test("args: chain (undefined)", () => {
  const client = createHealthApiClient({
    transport: {
      type: "http",
      url: "https://api.avax.network/ext/health",
    },
  });

  expect(client.chain).toBeUndefined();
});

describe("transports", () => {
  test("http", () => {
    const { uid, ...client } = createHealthApiClient({
      chain: avalanche,
      transport: {
        type: "http",
        url: "https://api.avax.network/ext/health",
      },
    });

    expect(uid).toBeDefined();
    expect(client.transport.type).toBe("http");
    expect(client.key).toBe("health");
    expect(client.name).toBe("Health API Client");
  });

  test("custom (converted to http for health client)", () => {
    const { uid, ...client } = createHealthApiClient({
      chain: avalanche,
      transport: mockTransport(),
    });

    expect(uid).toBeDefined();
    // Custom transport is converted to HTTP for non-wallet clients
    expect(client.transport.type).toBe("http");
    expect(client.key).toBe("health");
    expect(client.name).toBe("Health API Client");
  });
});

test("extend", () => {
  const { uid: _, ...client } = createHealthApiClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  expect(client).toHaveProperty("extend");
  expect(typeof client.extend).toBe("function");

  // Test that extend returns a client with the same structure
  const extended = client.extend(() => ({}));
  expect(extended).toHaveProperty("health");
  expect(extended).toHaveProperty("extend");
});

test("Health API methods are available", () => {
  const client = createHealthApiClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  // Verify all Health API methods are present
  expect(client).toHaveProperty("health");
  expect(client).toHaveProperty("liveness");
  expect(client).toHaveProperty("readiness");

  // Verify they are functions
  expect(typeof client.health).toBe("function");
  expect(typeof client.liveness).toBe("function");
  expect(typeof client.readiness).toBe("function");
});

describe("type tests", () => {
  test("HealthApiClient type", () => {
    const client = createHealthApiClient({
      chain: avalanche,
      transport: mockTransport(),
    });

    assertType<HealthApiClient>(client);
    assertType<typeof client.health>(client.health);
    assertType<typeof client.liveness>(client.liveness);
    assertType<typeof client.readiness>(client.readiness);
  });
});
