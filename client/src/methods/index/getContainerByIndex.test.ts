import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getContainerByIndex } from "./getContainerByIndex.js";
import type {
  GetContainerByIndexParameters,
  GetContainerByIndexReturnType,
} from "./types/getContainerByIndex.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "index.getContainerByIndex") {
    return {
      id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
      bytes: "0x1234567890abcdef",
      timestamp: "2024-01-01T00:00:00Z",
      encoding: "hex",
      index: "0",
    } as GetContainerByIndexReturnType;
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

describe("getContainerByIndex", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetContainerByIndexParameters = {
      index: 1,
      encoding: "hex",
    };

    await getContainerByIndex(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "index.getContainerByIndex",
      params: params,
    });
  });

  test("returns container details", async () => {
    const params: GetContainerByIndexParameters = {
      index: 1,
      encoding: "hex",
    };

    const result: GetContainerByIndexReturnType = await getContainerByIndex(
      client,
      params
    );
    expectTypeOf(result).toEqualTypeOf<GetContainerByIndexReturnType>();
    expect(result.id).toBe("6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY");
    expect(result.bytes).toBe("0x1234567890abcdef");
    expect(result.encoding).toBe("hex");
    expect(result.index).toBe("0");
  });
});
