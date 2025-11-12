import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import type {
  ValidatesParameters,
  ValidatesReturnType,
} from "./types/validates.js";
import { validates } from "./validates.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.validates") {
    return {
      blockchainIDs: ["11111111111111111111111111111111LpoYY"],
    } as unknown as ValidatesReturnType;
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

describe("validates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: ValidatesParameters = {
      subnetID: "11111111111111111111111111111111LpoYY",
    };

    await validates(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.validates",
      params: params,
    });
  });

  test("returns validation result", async () => {
    const params: ValidatesParameters = {
      subnetID: "11111111111111111111111111111111LpoYY",
    };

    const result = (await validates(client, params)) as ValidatesReturnType;
    expect(result.blockchainIDs).toBeDefined();
    expectTypeOf(result).toEqualTypeOf<ValidatesReturnType>();
  });
});
