import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getAllBalances } from "./getAllBalances.js";
import type {
  GetAllBalancesParameters,
  GetAllBalancesReturnType,
} from "./types/getAllBalances.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "avm.getAllBalances") {
    return {
      balances: [
        {
          asset: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
          balance: "1000000000",
        },
      ],
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

describe("getAllBalances", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetAllBalancesParameters = {
      addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
    };

    await getAllBalances(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "avm.getAllBalances",
      params: params,
    });
  });

  test("returns balances with BigInt values", async () => {
    const params: GetAllBalancesParameters = {
      addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
    };

    const result: GetAllBalancesReturnType = await getAllBalances(
      client,
      params
    );
    expectTypeOf(result).toEqualTypeOf<GetAllBalancesReturnType>();
    expect(result.balances).toBeDefined();
    expect(result.balances.length).toBe(1);
    expect(result.balances[0].balance).toBe(1000000000n);
  });
});
