import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import type { UptimeReturnType } from "./types/uptime.js";
import { uptime } from "./uptime.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "info.uptime") {
    return {
      rewardingStakePercentage: 100,
      weightedAveragePercentage: 100,
    } as UptimeReturnType;
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

describe("uptime", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await uptime(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "info.uptime",
      params: {},
    });
  });

  test("returns uptime statistics", async () => {
    const result: UptimeReturnType = await uptime(client);
    expectTypeOf(result).toEqualTypeOf<UptimeReturnType>();
    expect(result.rewardingStakePercentage).toBe(100);
    expect(result.weightedAveragePercentage).toBe(100);
  });
});
