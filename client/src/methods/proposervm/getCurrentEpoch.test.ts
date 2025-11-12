import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getCurrentEpoch } from "./getCurrentEpoch.js";
import type { GetCurrentEpochReturnType } from "./types/getCurrentEpoch.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "proposervm.getCurrentEpoch") {
    return {
      number: "1",
      startTime: "1000000",
      pChainHeight: "100",
    } as GetCurrentEpochReturnType;
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

describe("getCurrentEpoch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await getCurrentEpoch(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "proposervm.getCurrentEpoch",
      params: {},
    });
  });

  test("returns current epoch information", async () => {
    const result: GetCurrentEpochReturnType = await getCurrentEpoch(client);
    expectTypeOf(result).toEqualTypeOf<GetCurrentEpochReturnType>();
    expect(result.number).toBe("1");
    expect(result.startTime).toBe("1000000");
    expect(result.pChainHeight).toBe("100");
  });
});
