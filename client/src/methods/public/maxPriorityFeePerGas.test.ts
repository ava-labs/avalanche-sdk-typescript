import { createClient, createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { maxPriorityFeePerGas } from "./maxPriorityFeePerGas.js";
import type { MaxPriorityFeePerGasReturnType } from "./types/maxPriorityFeePerGas.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "eth_maxPriorityFeePerGas") {
    return "0x3b9aca00" as MaxPriorityFeePerGasReturnType;
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

describe("maxPriorityFeePerGas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await maxPriorityFeePerGas(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "eth_maxPriorityFeePerGas",
      params: [],
    });
  });

  test("returns max priority fee per gas", async () => {
    const result: MaxPriorityFeePerGasReturnType = await maxPriorityFeePerGas(
      client
    );
    expectTypeOf(result).toEqualTypeOf<MaxPriorityFeePerGasReturnType>();
    expect(result).toBe("0x3b9aca00");
  });
});
