import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { startCPUProfiler } from "./startCPUProfiler.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "admin.startCPUProfiler") {
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

describe("startCPUProfiler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await startCPUProfiler(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "admin.startCPUProfiler",
      params: {},
    });
  });

  test("returns void", async () => {
    const result = await startCPUProfiler(client);
    expect(result).toBeUndefined();
  });
});
