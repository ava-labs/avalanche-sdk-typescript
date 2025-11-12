import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getNodeIP } from "./getNodeIP.js";
import type { GetNodeIPReturnType } from "./types/getNodeIP.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "info.getNodeIP") {
    return {
      ip: "127.0.0.1",
    } as GetNodeIPReturnType;
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

describe("getNodeIP", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await getNodeIP(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "info.getNodeIP",
      params: {},
    });
  });

  test("returns node IP", async () => {
    const result: GetNodeIPReturnType = await getNodeIP(client);
    expectTypeOf(result).toEqualTypeOf<GetNodeIPReturnType>();
    expect(result.ip).toBe("127.0.0.1");
  });
});
