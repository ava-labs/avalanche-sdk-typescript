import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getValidatorsAt } from "./getValidatorsAt.js";
import type {
  GetValidatorsAtParameters,
  GetValidatorsAtReturnType,
} from "./types/getValidatorsAt.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getValidatorsAt") {
    return {
      validators: {
        "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg": 1000000000000,
      },
    } as GetValidatorsAtReturnType;
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

describe("getValidatorsAt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetValidatorsAtParameters = {
      height: 1000001,
      subnetID: "11111111111111111111111111111111LpoYY",
    };

    await getValidatorsAt(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getValidatorsAt",
      params: params,
    });
  });

  test("returns validators", async () => {
    const params: GetValidatorsAtParameters = {
      height: 1000001,
      subnetID: "11111111111111111111111111111111LpoYY",
    };

    const result = await getValidatorsAt(client, params);
    expectTypeOf(result).toEqualTypeOf<GetValidatorsAtReturnType>();
    expect(result.validators).toBeDefined();
    expect(result.validators["NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg"]).toBe(
      1000000000000
    );
  });
});
