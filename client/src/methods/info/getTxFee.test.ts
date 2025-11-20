import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getTxFee } from "./getTxFee.js";
import type { GetTxFeeReturnType } from "./types/getTxFee.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "info.getTxFee") {
    return {
      txFee: "1000000",
      createAssetTxFee: "1000000",
      createSubnetTxFee: "1000000",
      transformSubnetTxFee: "1000000",
      createBlockchainTxFee: "1000000",
      addPrimaryNetworkValidatorFee: "1000000",
      addPrimaryNetworkDelegatorFee: "1000000",
      addSubnetValidatorFee: "1000000",
      addSubnetDelegatorFee: "1000000",
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

describe("getTxFee", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await getTxFee(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "info.getTxFee",
      params: {},
    });
  });

  test("returns transaction fees as BigInt", async () => {
    const result: GetTxFeeReturnType = await getTxFee(client);
    expectTypeOf(result).toEqualTypeOf<GetTxFeeReturnType>();
    expect(result.txFee).toBe(1000000n);
    expect(result.createAssetTxFee).toBe(1000000n);
    expect(result.createSubnetTxFee).toBe(1000000n);
  });
});
