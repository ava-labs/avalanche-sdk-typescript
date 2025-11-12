import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getBlockchainID } from "./getBlockchainID.js";
import type {
  GetBlockchainIDParameters,
  GetBlockchainIDReturnType,
} from "./types/getBlockchainID.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "info.getBlockchainID") {
    return {
      blockchainID: "sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM",
    } as GetBlockchainIDReturnType;
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

describe("getBlockchainID", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetBlockchainIDParameters = {
      alias: "X",
    };

    await getBlockchainID(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "info.getBlockchainID",
      params: params,
    });
  });

  test("returns blockchain ID", async () => {
    const params: GetBlockchainIDParameters = {
      alias: "X",
    };

    const result: GetBlockchainIDReturnType = await getBlockchainID(
      client,
      params
    );
    expectTypeOf(result).toEqualTypeOf<GetBlockchainIDReturnType>();
    expect(result.blockchainID).toBe(
      "sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM"
    );
  });
});
