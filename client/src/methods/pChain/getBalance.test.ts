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
  if (method === "platform.getBalance") {
    return {
      balance: "1000000000000000000",
      unlocked: "500000000000000000",
      lockedStakeable: "300000000000000000",
      lockedNotStakeable: "200000000000000000",
      utxoIDs: [
        {
          txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
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
      addresses: ["P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
    };

    await getBalance(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getBalance",
      params: params,
    });
  });

  test("returns balance as BigInt", async () => {
    const params: GetBalanceParameters = {
      addresses: ["P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
    };

    const result: GetBalanceReturnType = await getBalance(client, params);
    expectTypeOf(result).toEqualTypeOf<GetBalanceReturnType>();
    expect(result.balance).toBe(BigInt("1000000000000000000"));
    expect(result.unlocked).toBe(BigInt("500000000000000000"));
    expect(result.lockedStakeable).toBe(BigInt("300000000000000000"));
    expect(result.lockedNotStakeable).toBe(BigInt("200000000000000000"));
    expect(result.utxoIDs).toBeDefined();
  });

  test("handles multiple addresses", async () => {
    const params: GetBalanceParameters = {
      addresses: [
        "P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy",
        "P-avax1gss39m5sx6jn7wlyzeqzm086yfq2l02xkvmecy",
      ],
    };

    await getBalance(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getBalance",
      params: params,
    });
  });
});
