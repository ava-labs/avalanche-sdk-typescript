import { createClient, createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { baseFee } from "./baseFee.js";
import type { BaseFeeReturnType } from "./types/baseFee.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "eth_baseFee") {
    return "0x3b9aca00" as BaseFeeReturnType;
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

const client = createClient({
  chain: avalanche,
  transport: mockTransport,
});

describe("baseFee", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await baseFee(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "eth_baseFee",
      params: [],
    });
  });

  test("returns base fee", async () => {
    const result: BaseFeeReturnType = await baseFee(client);
    expectTypeOf(result).toEqualTypeOf<BaseFeeReturnType>();
    expect(result).toBe("0x3b9aca00");
  });
});
