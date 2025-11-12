import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { isAccepted } from "./isAccepted.js";
import type {
  IsAcceptedParameters,
  IsAcceptedReturnType,
} from "./types/isAccepted.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "index.isAccepted") {
    return {
      isAccepted: true,
    } as IsAcceptedReturnType;
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

describe("isAccepted", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: IsAcceptedParameters = {
      id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
      encoding: "hex",
    };

    await isAccepted(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "index.isAccepted",
      params: params,
    });
  });

  test("returns acceptance status", async () => {
    const params: IsAcceptedParameters = {
      id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
      encoding: "hex",
    };

    const result: IsAcceptedReturnType = await isAccepted(client, params);
    expectTypeOf(result).toEqualTypeOf<IsAcceptedReturnType>();
    expect(result.isAccepted).toBe(true);
  });
});
