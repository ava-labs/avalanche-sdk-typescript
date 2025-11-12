import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { liveness } from "./liveness.js";
import type { LivenessReturnType } from "./types/liveness.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "health.liveness") {
    return {
      healthy: true,
      checks: {},
    } as LivenessReturnType;
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

describe("liveness", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await liveness(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "health.liveness",
      params: {},
    });
  });

  test("returns liveness status", async () => {
    const result: LivenessReturnType = await liveness(client);
    expectTypeOf(result).toEqualTypeOf<LivenessReturnType>();
    expect(result.healthy).toBe(true);
    expect(result.checks).toBeDefined();
  });
});
