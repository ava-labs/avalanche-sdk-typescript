import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getAtomicTx } from "./getAtomicTx.js";
import type {
  GetAtomicTxParameters,
  GetAtomicTxReturnType,
} from "./types/getAtomicTx.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "avax.getAtomicTx") {
    return {
      tx: "0x1234567890abcdef",
      blockHeight: "100",
      encoding: "hex",
    } as GetAtomicTxReturnType;
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

describe("getAtomicTx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetAtomicTxParameters = {
      txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
    };

    await getAtomicTx(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "avax.getAtomicTx",
      params: params,
    });
  });

  test("returns atomic transaction", async () => {
    const params: GetAtomicTxParameters = {
      txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
    };

    const result: GetAtomicTxReturnType = await getAtomicTx(client, params);
    expectTypeOf(result).toEqualTypeOf<GetAtomicTxReturnType>();
    expect(result.tx).toBe("0x1234567890abcdef");
    expect(result.blockHeight).toBe("100");
    expect(result.encoding).toBe("hex");
  });
});
