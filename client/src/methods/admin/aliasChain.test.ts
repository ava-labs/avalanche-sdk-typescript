import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { aliasChain } from "./aliasChain.js";
import type { AliasChainParameters } from "./types/aliasChain.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "admin.aliasChain") {
    return undefined;
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

describe("aliasChain", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: AliasChainParameters = {
      chain: "sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM",
      alias: "myBlockchainAlias",
    };

    await aliasChain(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "admin.aliasChain",
      params: params,
    });
  });

  test("returns void", async () => {
    const params: AliasChainParameters = {
      chain: "sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM",
      alias: "myBlockchainAlias",
    };

    const result = await aliasChain(client, params);
    expect(result).toBeUndefined();
  });

  test("handles empty string values", async () => {
    const params: AliasChainParameters = {
      chain: "",
      alias: "",
    };

    await aliasChain(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "admin.aliasChain",
      params: {
        chain: "",
        alias: "",
      },
    });
  });
});
