import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { alias } from "./alias.js";
import type { AliasParameters } from "./types/alias.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "admin.alias") {
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

describe("alias", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: AliasParameters = {
      endpoint: "bc/X",
      alias: "myAlias",
    };

    await alias(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "admin.alias",
      params: params,
    });
  });

  test("returns void", async () => {
    const params: AliasParameters = {
      endpoint: "bc/X",
      alias: "myAlias",
    };

    const result = await alias(client, params);
    expect(result).toBeUndefined();
  });

  test("handles empty string values", async () => {
    const params: AliasParameters = {
      endpoint: "",
      alias: "",
    };

    await alias(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "admin.alias",
      params: {
        endpoint: "",
        alias: "",
      },
    });
  });
});
