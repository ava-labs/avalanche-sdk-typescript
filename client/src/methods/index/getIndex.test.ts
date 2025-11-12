import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getIndex } from "./getIndex.js";
import type {
  GetIndexParameters,
  GetIndexReturnType,
} from "./types/getIndex.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "index.getIndex") {
    return {
      index: "0",
    } as GetIndexReturnType;
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

describe("getIndex", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetIndexParameters = {
      id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
      encoding: "hex",
    };

    await getIndex(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "index.getIndex",
      params: params,
    });
  });

  test("returns index", async () => {
    const params: GetIndexParameters = {
      id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
      encoding: "hex",
    };

    const result: GetIndexReturnType = await getIndex(client, params);
    expectTypeOf(result).toEqualTypeOf<GetIndexReturnType>();
    expect(result.index).toBe("0");
  });
});
