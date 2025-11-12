import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getTxFee } from "./getTxFee.js";
import type { GetTxFeeReturnType } from "./types/getTxFee.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "avm.getTxFee") {
    return {
      txFee: 1000000,
      createAssetTxFee: 2000000,
    } as GetTxFeeReturnType;
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

describe("getTxFee", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await getTxFee(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "avm.getTxFee",
      params: {},
    });
  });

  test("returns transaction fee", async () => {
    const result: GetTxFeeReturnType = await getTxFee(client);
    expectTypeOf(result).toEqualTypeOf<GetTxFeeReturnType>();
    expect(result.txFee).toBe(1000000);
    expect(result.createAssetTxFee).toBe(2000000);
  });
});
