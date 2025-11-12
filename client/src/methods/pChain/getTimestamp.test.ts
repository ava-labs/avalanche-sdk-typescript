import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getTimestamp } from "./getTimestamp.js";
import { GetTimestampReturnType } from "./types/getTimestamp.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getTimestamp") {
    return { timestamp: "1678886400" } as GetTimestampReturnType;
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

describe("getTimestamp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    await getTimestamp(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getTimestamp",
      params: {},
    });
  });

  test("returns timestamp", async () => {
    const result = await getTimestamp(client);
    expectTypeOf(result).toEqualTypeOf<GetTimestampReturnType>();
    expect(result.timestamp).toBe("1678886400");
  });
});
