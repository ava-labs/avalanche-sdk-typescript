import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getTxStatus } from "./getTxStatus.js";
import type {
  GetTxStatusParameters,
  GetTxStatusReturnType,
} from "./types/getTxStatus.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "avm.getTxStatus") {
    return {
      status: "Accepted",
    } as GetTxStatusReturnType;
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

describe("getTxStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetTxStatusParameters = {
      txID: "2QouvMUbQ6tchBHSJdZ7MoFhsQhHt5KqZQqHdZ7MoFhsQhHt5KqZQ",
    };

    await getTxStatus(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "avm.getTxStatus",
      params: params,
    });
  });

  test("returns transaction status", async () => {
    const params: GetTxStatusParameters = {
      txID: "2QouvMUbQ6tchBHSJdZ7MoFhsQhHt5KqZQqHdZ7MoFhsQhHt5KqZQ",
    };

    const result: GetTxStatusReturnType = await getTxStatus(client, params);
    expectTypeOf(result).toEqualTypeOf<GetTxStatusReturnType>();
    expect(result.status).toBe("Accepted");
  });
});
