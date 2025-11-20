import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getBalance } from "./getBalance.js";
import type {
  GetBalanceParameters,
  GetBalanceReturnType,
} from "./types/getBalance.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "avm.getBalance") {
    return {
      balance: "1000000000",
      utxoIDs: [
        {
          txID: "2QouvMUbQ6tchBHSJdZ7MoFhsQhHt5KqZQqHdZ7MoFhsQhHt5KqZQ",
          outputIndex: 0,
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

describe("getBalance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetBalanceParameters = {
      address: "X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5",
      assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
    };

    await getBalance(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "avm.getBalance",
      params: params,
    });
  });

  test("returns balance as BigInt", async () => {
    const params: GetBalanceParameters = {
      address: "X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5",
      assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
    };

    const result: GetBalanceReturnType = await getBalance(client, params);
    expectTypeOf(result).toEqualTypeOf<GetBalanceReturnType>();
    expect(result.balance).toBe(1000000000n);
    expect(result.utxoIDs).toBeDefined();
    expect(result.utxoIDs.length).toBe(1);
  });
});
