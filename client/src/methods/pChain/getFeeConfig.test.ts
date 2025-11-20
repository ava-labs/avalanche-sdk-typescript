import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getFeeConfig } from "./getFeeConfig.js";
import type { GetFeeConfigReturnType } from "./types/getFeeConfig.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getFeeConfig") {
    return {
      weights: [1, 1, 1, 1],
      maxCapacity: "1000000",
      maxPerSecond: "1000",
      targetPerSecond: "100",
      minPrice: "100000",
      excessConversionConstant: "1000000",
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

describe("getFeeConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    await getFeeConfig(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getFeeConfig",
      params: {},
    });
  });

  test("returns fee config with BigInt values", async () => {
    const result: GetFeeConfigReturnType = await getFeeConfig(client);
    expectTypeOf(result).toEqualTypeOf<GetFeeConfigReturnType>();
    expect(result.maxCapacity).toBe(BigInt("1000000"));
    expect(result.maxPerSecond).toBe(BigInt("1000"));
    expect(result.targetPerSecond).toBe(BigInt("100"));
    expect(result.minPrice).toBe(BigInt("100000"));
    expect(result.excessConversionConstant).toBe(BigInt("1000000"));
    expect(result.weights).toEqual([1, 1, 1, 1]);
  });
});
