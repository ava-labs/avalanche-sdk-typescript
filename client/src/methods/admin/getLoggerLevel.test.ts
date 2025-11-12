import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getLoggerLevel } from "./getLoggerLevel.js";
import type { GetLoggerLevelParameters } from "./types/getLoggerLevel.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "admin.getLoggerLevel") {
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
  }
  throw new Error(`Unexpected method: ${method}`);
});

const mockTransport = () =>
  createTransport({
    key: "mock",
    name: "Mock Transport",
    request: mockRequest as unknown as EIP1193RequestFn,
    type: "mock",
  });

const client = createAvalancheBaseClient({
  chain: avalanche,
  transport: mockTransport,
});

describe("getLoggerLevel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetLoggerLevelParameters = {
      loggerName: "C",
    };

    await getLoggerLevel(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "admin.getLoggerLevel",
      params: params,
    });
  });

  test("returns logger levels", async () => {
    const params: GetLoggerLevelParameters = {
      loggerName: "C",
    };

    const result = await getLoggerLevel(client, params);
    expect(result).toEqual({
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
    });
  });

  test("handles optional loggerName parameter", async () => {
    const params: GetLoggerLevelParameters = {};

    await getLoggerLevel(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "admin.getLoggerLevel",
      params: {},
    });
  });
});
