import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getTotalStake } from "./getTotalStake.js";
import type {
  GetTotalStakeParameters,
  GetTotalStakeReturnType,
} from "./types/getTotalStake.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getTotalStake") {
    return {
      stake: 1000000000000000000,
      weight: 1000000000000000000,
    } as GetTotalStakeReturnType;
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

describe("getTotalStake", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetTotalStakeParameters = {
      subnetID: "11111111111111111111111111111111LpoYY",
    };

    await getTotalStake(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getTotalStake",
      params: params,
    });
  });

  test("returns total stake", async () => {
    const params: GetTotalStakeParameters = {
      subnetID: "11111111111111111111111111111111LpoYY",
    };

    const result = await getTotalStake(client, params);
    expectTypeOf(result).toEqualTypeOf<GetTotalStakeReturnType>();
    expect(result.stake).toBe(1000000000000000000);
    expect(result.weight).toBe(1000000000000000000);
  });
});
