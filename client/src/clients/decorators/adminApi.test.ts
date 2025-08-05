import { createTransport, EIP1193RequestFn } from "viem";
import { describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../createAvalancheBaseClient.js";
import { adminAPIActions } from "./adminApi.js";

const mockTransport = () =>
  createTransport({
    key: "mock",
    name: "Mock Transport",
    request: vi.fn(async ({ method }) => {
      switch (method) {
        case "admin.alias":
          return {};
        case "admin.aliasChain":
          return {};
        case "admin.getChainAliases":
          return {
            aliases: ["myBlockchainAlias", "anotherAlias"],
          };
        case "admin.getLoggerLevel":
          return {
            loggerLevels: {
              C: {
                logLevel: "INFO",
                displayLevel: "INFO",
              },
              P: {
                logLevel: "DEBUG",
                displayLevel: "WARN",
              },
              X: {
                logLevel: "ERROR",
                displayLevel: "ERROR",
              },
            },
          };
        case "admin.loadVMs":
          return {
            newVMs: {
              rWmY6Sh7P9mjQoTfXd89un7WoroFezFXp: ["vm1", "vm2"],
              tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH: ["vm3"],
            },
            failedVMs: {
              failedVM1: "Failed to load: missing dependencies",
            },
          };
        case "admin.lockProfile":
          return {};
        case "admin.memoryProfile":
          return {};
        case "admin.setLoggerLevel":
          return {};
        case "admin.startCPUProfiler":
          return {};
        case "admin.stopCPUProfiler":
          return {};
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

const adminClient = adminAPIActions(client);

test("default", async () => {
  expect(adminClient).toMatchInlineSnapshot(`{
  "alias": [Function],
  "aliasChain": [Function],
  "getChainAliases": [Function],
  "getLoggerLevel": [Function],
  "loadVMs": [Function],
  "lockProfile": [Function],
  "memoryProfile": [Function],
  "setLoggerLevel": [Function],
  "startCPUProfiler": [Function],
  "stopCPUProfiler": [Function],
}`);
});

describe("smoke test", () => {
  test("alias", async () => {
    const res = await adminClient.alias({
      endpoint: "bc/X",
      alias: "myAlias",
    });
    expect(res).toStrictEqual({});
  });

  test("aliasChain", async () => {
    const res = await adminClient.aliasChain({
      chain: "sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM",
      alias: "myBlockchainAlias",
    });
    expect(res).toStrictEqual({});
  });

  test("getChainAliases", async () => {
    const res = await adminClient.getChainAliases({
      chain: "sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM",
    });
    expect(res).toStrictEqual({
      aliases: ["myBlockchainAlias", "anotherAlias"],
    });
  });

  test("getLoggerLevel", async () => {
    const res = await adminClient.getLoggerLevel({
      loggerName: "C",
    });
    expect(res).toStrictEqual({
      loggerLevels: {
        C: {
          displayLevel: "INFO",
          logLevel: "INFO",
        },
        P: {
          displayLevel: "WARN",
          logLevel: "DEBUG",
        },
        X: {
          displayLevel: "ERROR",
          logLevel: "ERROR",
        },
      },
    });
  });

  test("getLoggerLevel without loggerName", async () => {
    const res = await adminClient.getLoggerLevel({});
    expect(res).toStrictEqual({
      loggerLevels: {
        C: {
          displayLevel: "INFO",
          logLevel: "INFO",
        },
        P: {
          displayLevel: "WARN",
          logLevel: "DEBUG",
        },
        X: {
          displayLevel: "ERROR",
          logLevel: "ERROR",
        },
      },
    });
  });

  test("loadVMs", async () => {
    const res = await adminClient.loadVMs();
    expect(res).toStrictEqual({
      failedVMs: {
        failedVM1: "Failed to load: missing dependencies",
      },
      newVMs: {
        rWmY6Sh7P9mjQoTfXd89un7WoroFezFXp: ["vm1", "vm2"],
        tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH: ["vm3"],
      },
    });
  });

  test("lockProfile", async () => {
    const res = await adminClient.lockProfile();
    expect(res).toStrictEqual({});
  });

  test("memoryProfile", async () => {
    const res = await adminClient.memoryProfile();
    expect(res).toStrictEqual({});
  });

  test("setLoggerLevel", async () => {
    const res = await adminClient.setLoggerLevel({
      loggerName: "C",
      logLevel: "DEBUG",
      displayLevel: "INFO",
    });
    expect(res).toStrictEqual({});
  });

  test("startCPUProfiler", async () => {
    const res = await adminClient.startCPUProfiler();
    expect(res).toStrictEqual({});
  });

  test("stopCPUProfiler", async () => {
    const res = await adminClient.stopCPUProfiler();
    expect(res).toStrictEqual({});
  });
});
