import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import type {
  ValidatedByParameters,
  ValidatedByReturnType,
} from "./types/validatedBy.js";
import { validatedBy } from "./validatedBy.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.validatedBy") {
    return {
      subnetID: "11111111111111111111111111111111LpoYY",
    } as ValidatedByReturnType;
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

describe("validatedBy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: ValidatedByParameters = {
      blockchainID: "11111111111111111111111111111111LpoYY",
    };

    await validatedBy(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.validatedBy",
      params: params,
    });
  });

  test("returns validators", async () => {
    const params: ValidatedByParameters = {
      blockchainID: "11111111111111111111111111111111LpoYY",
    };

    const result = await validatedBy(client, params);
    expectTypeOf(result).toEqualTypeOf<ValidatedByReturnType>();
    expect(result.subnetID).toBe("11111111111111111111111111111111LpoYY");
  });
});
