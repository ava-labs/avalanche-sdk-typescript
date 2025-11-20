import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { isBootstrapped } from "./isBootstrapped.js";
import type {
  IsBootstrappedParameters,
  IsBootstrappedReturnType,
} from "./types/isBootstrapped.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "info.isBootstrapped") {
    return {
      isBootstrapped: true,
    } as IsBootstrappedReturnType;
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

describe("isBootstrapped", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: IsBootstrappedParameters = {
      chain: "X",
    };

    await isBootstrapped(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "info.isBootstrapped",
      params: params,
    });
  });

  test("returns bootstrapped status", async () => {
    const params: IsBootstrappedParameters = {
      chain: "X",
    };

    const result: IsBootstrappedReturnType = await isBootstrapped(
      client,
      params
    );
    expectTypeOf(result).toEqualTypeOf<IsBootstrappedReturnType>();
    expect(result.isBootstrapped).toBe(true);
  });
});
