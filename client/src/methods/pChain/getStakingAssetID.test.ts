import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getStakingAssetID } from "./getStakingAssetID.js";
import type {
  GetStakingAssetIDParameters,
  GetStakingAssetIDReturnType,
} from "./types/getStakingAssetID.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getStakingAssetID") {
    return {
      assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
    } as GetStakingAssetIDReturnType;
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

describe("getStakingAssetID", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetStakingAssetIDParameters = {
      subnetID: "11111111111111111111111111111111LpoYY",
    };

    await getStakingAssetID(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getStakingAssetID",
      params: params,
    });
  });

  test("returns staking asset ID", async () => {
    const params: GetStakingAssetIDParameters = {
      subnetID: "11111111111111111111111111111111LpoYY",
    };

    const result = await getStakingAssetID(client, params);
    expectTypeOf(result).toEqualTypeOf<GetStakingAssetIDReturnType>();
    expect(result.assetID).toBe(
      "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"
    );
  });
});
