import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getAtomicTxStatus } from "./getAtomicTxStatus.js";
import type {
  GetAtomicTxStatusParameters,
  GetAtomicTxStatusReturnType,
} from "./types/getAtomicTxStatus.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "avax.getAtomicTxStatus") {
    return {
      status: "Accepted",
      blockHeight: "100",
    } as GetAtomicTxStatusReturnType;
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

describe("getAtomicTxStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetAtomicTxStatusParameters = {
      txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
    };

    await getAtomicTxStatus(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "avax.getAtomicTxStatus",
      params: params,
    });
  });

  test("returns atomic transaction status", async () => {
    const params: GetAtomicTxStatusParameters = {
      txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
    };

    const result: GetAtomicTxStatusReturnType = await getAtomicTxStatus(
      client,
      params
    );
    expectTypeOf(result).toEqualTypeOf<GetAtomicTxStatusReturnType>();
    expect(result.status).toBe("Accepted");
    expect(result.blockHeight).toBe("100");
  });
});
