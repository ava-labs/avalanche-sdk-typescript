import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { issueTx } from "./issueTx.js";
import type { IssueTxParameters, IssueTxReturnType } from "./types/issueTx.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "avm.issueTx") {
    return {
      txID: "2QouvMUbQ6tchBHSJdZ7MoFhsQhHt5KqZQqHdZ7MoFhsQhHt5KqZQ",
    } as IssueTxReturnType;
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

describe("issueTx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: IssueTxParameters = {
      tx: "0x1234567890abcdef",
      encoding: "hex",
    };

    await issueTx(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "avm.issueTx",
      params: params,
    });
  });

  test("returns transaction ID", async () => {
    const params: IssueTxParameters = {
      tx: "0x1234567890abcdef",
      encoding: "hex",
    };

    const result: IssueTxReturnType = await issueTx(client, params);
    expectTypeOf(result).toEqualTypeOf<IssueTxReturnType>();
    expect(result.txID).toBe(
      "2QouvMUbQ6tchBHSJdZ7MoFhsQhHt5KqZQqHdZ7MoFhsQhHt5KqZQ"
    );
  });
});
