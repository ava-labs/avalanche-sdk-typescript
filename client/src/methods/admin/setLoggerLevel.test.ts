import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { setLoggerLevel } from "./setLoggerLevel.js";
import type { SetLoggerLevelParameters } from "./types/setLoggerLevel.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "admin.setLoggerLevel") {
    return undefined;
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

describe("setLoggerLevel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: SetLoggerLevelParameters = {
      loggerName: "C",
      logLevel: "DEBUG",
      displayLevel: "INFO",
    };

    await setLoggerLevel(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "admin.setLoggerLevel",
      params: params,
    });
  });

  test("returns void", async () => {
    const params: SetLoggerLevelParameters = {
      loggerName: "C",
      logLevel: "DEBUG",
      displayLevel: "INFO",
    };

    const result = await setLoggerLevel(client, params);
    expect(result).toBeUndefined();
  });

  test("handles different log levels", async () => {
    const params: SetLoggerLevelParameters = {
      loggerName: "P",
      logLevel: "WARN",
      displayLevel: "ERROR",
    };

    await setLoggerLevel(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "admin.setLoggerLevel",
      params: {
        loggerName: "P",
        logLevel: "WARN",
        displayLevel: "ERROR",
      },
    });
  });
});
