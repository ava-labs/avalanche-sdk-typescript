import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getChainAliases } from "./getChainAliases.js";
import type { GetChainAliasesParameters } from "./types/getChainAliases.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "admin.getChainAliases") {
    return {
      aliases: ["myBlockchainAlias", "anotherAlias"],
    };
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

describe("getChainAliases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetChainAliasesParameters = {
      chain: "sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM",
    };

    await getChainAliases(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "admin.getChainAliases",
      params: params,
    });
  });

  test("returns aliases", async () => {
    const params: GetChainAliasesParameters = {
      chain: "sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM",
    };

    const result = await getChainAliases(client, params);
    expect(result).toEqual({
      aliases: ["myBlockchainAlias", "anotherAlias"],
    });
  });
});
