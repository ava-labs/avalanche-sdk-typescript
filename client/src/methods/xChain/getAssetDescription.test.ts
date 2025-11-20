import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getAssetDescription } from "./getAssetDescription.js";
import type {
  GetAssetDescriptionParameters,
  GetAssetDescriptionReturnType,
} from "./types/getAssetDescription.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "avm.getAssetDescription") {
    return {
      assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
      name: "Avalanche",
      symbol: "AVAX",
      denomination: 9,
    } as GetAssetDescriptionReturnType;
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

describe("getAssetDescription", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetAssetDescriptionParameters = {
      assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
    };

    await getAssetDescription(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "avm.getAssetDescription",
      params: params,
    });
  });

  test("returns asset description", async () => {
    const params: GetAssetDescriptionParameters = {
      assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
    };

    const result: GetAssetDescriptionReturnType = await getAssetDescription(
      client,
      params
    );
    expectTypeOf(result).toEqualTypeOf<GetAssetDescriptionReturnType>();
    expect(result.assetID).toBe(
      "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"
    );
    expect(result.name).toBe("Avalanche");
    expect(result.symbol).toBe("AVAX");
    expect(result.denomination).toBe(9);
  });
});
