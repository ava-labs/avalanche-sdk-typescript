import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { buildGenesis } from "./buildGenesis.js";
import type {
  BuildGenesisParameters,
  BuildGenesisReturnType,
} from "./types/buildGenesis.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "avm.buildGenesis") {
    return {
      bytes: "0x1234567890abcdef",
      encoding: "hex",
    } as BuildGenesisReturnType;
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

describe("buildGenesis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: BuildGenesisParameters = {
      networkID: 16,
      genesisData: {
        name: "myFixedCapAsset",
        symbol: "MFCA",
        denomination: 9,
        initialState: {
          fixedCap: {
            amount: 100000,
            addresses: ["avax13ery2kvdrkd2nkquvs892gl8hg7mq4a6ufnrn6"],
          },
        },
      },
      encoding: "hex",
    };

    await buildGenesis(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "avm.buildGenesis",
      params: params,
    });
  });

  test("returns genesis bytes", async () => {
    const params: BuildGenesisParameters = {
      networkID: 16,
      genesisData: {
        name: "myFixedCapAsset",
        symbol: "MFCA",
        denomination: 9,
        initialState: {
          fixedCap: {
            amount: 100000,
            addresses: ["avax13ery2kvdrkd2nkquvs892gl8hg7mq4a6ufnrn6"],
          },
        },
      },
      encoding: "hex",
    };

    const result: BuildGenesisReturnType = await buildGenesis(client, params);
    expectTypeOf(result).toEqualTypeOf<BuildGenesisReturnType>();
    expect(result.bytes).toBe("0x1234567890abcdef");
    expect(result.encoding).toBe("hex");
  });
});
