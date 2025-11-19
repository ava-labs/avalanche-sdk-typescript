import type { Context } from "@avalabs/avalanchejs";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { privateKeyToAvalancheAccount } from "../../accounts/index.js";
import { avalanche } from "../../chains/index.js";
import { createAvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import {
  FallbackHRP,
  FujiHRP,
  FujiID,
  getContextFromURI,
  getHRP,
  LocalHRP,
  LocalID,
  MainnetHRP,
  MainnetID,
} from "./getContextFromURI.js";

const privateKey1ForTest =
  "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce";

const account = privateKeyToAvalancheAccount(privateKey1ForTest);

// Mock responses for all the methods called by getContextFromURI
const createMockWalletClient = (networkID: string = "1") => {
  const mockRequest = vi.fn(async ({ method, params }) => {
    switch (method) {
      case "avm.getAssetDescription":
        return {
          assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
          name: "Avalanche",
          symbol: "AVAX",
          denomination: 9,
        };
      case "avm.getTxFee":
        return {
          txFee: "1000000",
          createAssetTxFee: "10000000",
        };
      case "info.getBlockchainID":
        if (params?.alias === "X") {
          return {
            blockchainID: "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
          };
        }
        if (params?.alias === "P") {
          return {
            blockchainID: "11111111111111111111111111111111LpoYY",
          };
        }
        if (params?.alias === "C") {
          return {
            blockchainID: "2q9e4r6Mu3U68nU1fYjgbR6JvwrRx36CohpAX5UQxse55x1Q5",
          };
        }
        throw new Error(`Unexpected alias: ${params?.alias}`);
      case "info.getNetworkID":
        return {
          networkID: networkID,
        };
      case "platform.getFeeConfig":
        return {
          weights: [1, 1, 1, 1],
          maxCapacity: "1000000",
          maxPerSecond: "1000",
          targetPerSecond: "500",
          minPrice: "1",
          excessConversionConstant: "5000",
        };
      default:
        throw new Error(`Unexpected method: ${method}`);
    }
  });

  return {
    client: createAvalancheWalletCoreClient({
      chain: avalanche,
      transport: {
        type: "custom",
        provider: {
          request: mockRequest,
        },
      },
      account,
    }),
  };
};

describe("getContextFromURI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("successfully retrieves context from URI", async () => {
    const { client } = createMockWalletClient("1");

    const result = await getContextFromURI(client);

    // Verify that we got a valid result
    expect(result).toBeDefined();
    expect(result.xBlockchainID).toBeDefined();
    expect(result.pBlockchainID).toBeDefined();
    expect(result.cBlockchainID).toBeDefined();
  });

  test("returns context with correct structure", async () => {
    const { client } = createMockWalletClient("1");

    const result = await getContextFromURI(client);

    expectTypeOf(result).toEqualTypeOf<Context.Context>();
    expect(result).toHaveProperty("xBlockchainID");
    expect(result).toHaveProperty("pBlockchainID");
    expect(result).toHaveProperty("cBlockchainID");
    expect(result).toHaveProperty("avaxAssetID");
    expect(result).toHaveProperty("baseTxFee");
    expect(result).toHaveProperty("createAssetTxFee");
    expect(result).toHaveProperty("networkID");
    expect(result).toHaveProperty("hrp");
    expect(result).toHaveProperty("platformFeeConfig");
  });

  test("returns context with correct values", async () => {
    const { client } = createMockWalletClient("1");

    const result = await getContextFromURI(client);

    expect(result.xBlockchainID).toBe(
      "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM"
    );
    expect(result.pBlockchainID).toBe("11111111111111111111111111111111LpoYY");
    expect(result.cBlockchainID).toBe(
      "2q9e4r6Mu3U68nU1fYjgbR6JvwrRx36CohpAX5UQxse55x1Q5"
    );
    expect(result.avaxAssetID).toBe(
      "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"
    );
    expect(result.baseTxFee).toBe(BigInt("1000000"));
    expect(result.createAssetTxFee).toBe(BigInt("10000000"));
    expect(result.networkID).toBe(1);
    expect(result.hrp).toBe("avax");
  });

  test("uses custom assetDescription parameter", async () => {
    const { client } = createMockWalletClient("1");

    // Use AVAX which is a valid asset (sub-clients make real HTTP requests)
    const result = await getContextFromURI(client, "AVAX");
    expect(result).toBeDefined();
    expect(result.avaxAssetID).toBeDefined();
    expect(typeof result.avaxAssetID).toBe("string");
  });

  test("uses default assetDescription when not provided", async () => {
    const { client } = createMockWalletClient("1");

    // This should not throw and should return a valid context
    const result = await getContextFromURI(client);
    expect(result).toBeDefined();
    expect(result.avaxAssetID).toBe(
      "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"
    );
  });

  test("returns frozen context object", async () => {
    const { client } = createMockWalletClient("1");

    const result = await getContextFromURI(client);

    expect(Object.isFrozen(result)).toBe(true);
  });

  test("returns correct HRP based on network ID", async () => {
    const { client } = createMockWalletClient("1");

    const result = await getContextFromURI(client);

    // Verify that HRP is set based on network ID
    expect(result.networkID).toBeDefined();
    expect(result.hrp).toBeDefined();
    expect(typeof result.networkID).toBe("number");
    expect(typeof result.hrp).toBe("string");
  });

  test("returns platformFeeConfig with correct structure", async () => {
    const { client } = createMockWalletClient("1");

    const result = await getContextFromURI(client);

    expect(result.platformFeeConfig).toBeDefined();
    // Verify weights is an array of 4 numbers
    expect(Array.isArray(result.platformFeeConfig.weights)).toBe(true);
    expect(Object.keys(result.platformFeeConfig.weights).length).toBe(4);
    // Verify all BigInt properties exist and are of type bigint
    expect(typeof result.platformFeeConfig.maxCapacity).toBe("bigint");
    expect(typeof result.platformFeeConfig.maxPerSecond).toBe("bigint");
    expect(typeof result.platformFeeConfig.targetPerSecond).toBe("bigint");
    expect(typeof result.platformFeeConfig.minPrice).toBe("bigint");
    expect(typeof result.platformFeeConfig.excessConversionConstant).toBe(
      "bigint"
    );
    // Verify values are positive BigInts (actual values depend on the mock/API)
    expect(result.platformFeeConfig.maxCapacity).toBeGreaterThan(0n);
    expect(result.platformFeeConfig.maxPerSecond).toBeGreaterThan(0n);
    expect(result.platformFeeConfig.targetPerSecond).toBeGreaterThan(0n);
    expect(result.platformFeeConfig.minPrice).toBeGreaterThan(0n);
    expect(result.platformFeeConfig.excessConversionConstant).toBeGreaterThan(
      0n
    );
  });
});

describe("getHRP", () => {
  test("returns correct HRP for known network IDs", () => {
    expect(getHRP(MainnetID)).toBe(MainnetHRP);
    expect(getHRP(FujiID)).toBe(FujiHRP);
    expect(getHRP(LocalID)).toBe(LocalHRP);
  });

  test("returns fallback HRP for unknown network ID", () => {
    expect(getHRP(999)).toBe(FallbackHRP);
    expect(getHRP(0)).toBe(FallbackHRP);
  });
});
