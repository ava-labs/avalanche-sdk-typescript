import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getCurrentSupply } from "./getCurrentSupply.js";
import type {
  GetCurrentSupplyParameters,
  GetCurrentSupplyReturnType,
} from "./types/getCurrentSupply.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getCurrentSupply") {
    return {
      supply: "1000000000000000000",
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

describe("getCurrentSupply", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetCurrentSupplyParameters = {
      subnetId: "11111111111111111111111111111111LpoYY",
    };

    await getCurrentSupply(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getCurrentSupply",
      params: params,
    });
  });

  test("returns supply as BigInt", async () => {
    const params: GetCurrentSupplyParameters = {
      subnetId: "11111111111111111111111111111111LpoYY",
    };

    const result: GetCurrentSupplyReturnType = await getCurrentSupply(
      client,
      params
    );
    expectTypeOf(result).toEqualTypeOf<GetCurrentSupplyReturnType>();
    expect(result.supply).toBe(BigInt("1000000000000000000"));
  });
});
