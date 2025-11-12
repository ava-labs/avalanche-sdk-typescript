import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getNetworkName } from "./getNetworkName.js";
import type { GetNetworkNameReturnType } from "./types/getNetworkName.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "info.getNetworkName") {
    return {
      networkName: "mainnet",
    } as GetNetworkNameReturnType;
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

describe("getNetworkName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await getNetworkName(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "info.getNetworkName",
      params: {},
    });
  });

  test("returns network name", async () => {
    const result: GetNetworkNameReturnType = await getNetworkName(client);
    expectTypeOf(result).toEqualTypeOf<GetNetworkNameReturnType>();
    expect(result.networkName).toBe("mainnet");
  });
});
