import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getMinStake } from "./getMinStake.js";
import type {
  GetMinStakeParameters,
  GetMinStakeReturnType,
} from "./types/getMinStake.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getMinStake") {
    return {
      minValidatorStake: "2000000000000",
      minDelegatorStake: "25000000000",
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

describe("getMinStake", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetMinStakeParameters = {
      subnetID: "11111111111111111111111111111111LpoYY",
    };

    await getMinStake(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getMinStake",
      params: params,
    });
  });

  test("returns min stake as BigInt", async () => {
    const params: GetMinStakeParameters = {
      subnetID: "11111111111111111111111111111111LpoYY",
    };

    const result: GetMinStakeReturnType = await getMinStake(client, params);
    expectTypeOf(result).toEqualTypeOf<GetMinStakeReturnType>();
    expect(result.minValidatorStake).toBe(BigInt("2000000000000"));
    expect(result.minDelegatorStake).toBe(BigInt("25000000000"));
  });
});
