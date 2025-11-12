import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getFeeState } from "./getFeeState.js";
import { GetFeeStateReturnType } from "./types/getFeeState.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getFeeState") {
    return {
      capacity: "1000000",
      excess: "500000",
      price: "100000",
      timestamp: "1678886400",
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

describe("getFeeState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    await getFeeState(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getFeeState",
      params: {},
    });
  });

  test("returns fee state with BigInt values", async () => {
    const result: GetFeeStateReturnType = await getFeeState(client);
    expectTypeOf(result).toEqualTypeOf<GetFeeStateReturnType>();
    expect(result.capacity).toBe(BigInt("1000000"));
    expect(result.excess).toBe(BigInt("500000"));
    expect(result.price).toBe(BigInt("100000"));
    expect(result.timestamp).toBe("1678886400");
  });
});
