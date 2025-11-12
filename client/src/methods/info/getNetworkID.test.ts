import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getNetworkID } from "./getNetworkID.js";
import type { GetNetworkIDReturnType } from "./types/getNetworkID.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "info.getNetworkID") {
    return {
      networkID: "1",
    } as GetNetworkIDReturnType;
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

describe("getNetworkID", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await getNetworkID(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "info.getNetworkID",
      params: {},
    });
  });

  test("returns network ID", async () => {
    const result: GetNetworkIDReturnType = await getNetworkID(client);
    expectTypeOf(result).toEqualTypeOf<GetNetworkIDReturnType>();
    expect(result.networkID).toBe("1");
  });
});
