import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { stopCPUProfiler } from "./stopCPUProfiler.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "admin.stopCPUProfiler") {
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

describe("stopCPUProfiler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await stopCPUProfiler(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "admin.stopCPUProfiler",
      params: {},
    });
  });

  test("returns void", async () => {
    const result = await stopCPUProfiler(client);
    expect(result).toBeUndefined();
  });
});
