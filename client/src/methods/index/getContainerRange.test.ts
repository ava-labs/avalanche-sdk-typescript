import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getContainerRange } from "./getContainerRange.js";
import type {
  GetContainerRangeParameters,
  GetContainerRangeReturnType,
} from "./types/getContainerRange.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "index.getContainerRange") {
    return {
      containers: [
        {
          id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
          bytes: "0x1234567890abcdef",
          timestamp: "2024-01-01T00:00:00Z",
          encoding: "hex",
          index: "0",
        },
      ],
    } as GetContainerRangeReturnType;
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

describe("getContainerRange", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetContainerRangeParameters = {
      startIndex: 0,
      endIndex: 10,
      encoding: "hex",
    };

    await getContainerRange(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "index.getContainerRange",
      params: params,
    });
  });

  test("returns container range", async () => {
    const params: GetContainerRangeParameters = {
      startIndex: 0,
      endIndex: 10,
      encoding: "hex",
    };

    const result: GetContainerRangeReturnType = await getContainerRange(
      client,
      params
    );
    expectTypeOf(result).toEqualTypeOf<GetContainerRangeReturnType>();
    expect(result.containers).toBeDefined();
    expect(result.containers.length).toBeGreaterThan(0);
  });
});
