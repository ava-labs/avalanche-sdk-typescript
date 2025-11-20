import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getBlockByHeight } from "./getBlockByHeight.js";
import type {
  GetBlockByHeightParameters,
  GetBlockByHeightReturnType,
} from "./types/getBlockByHeight.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "avm.getBlockByHeight") {
    return {
      block: "0x1234567890abcdef",
      encoding: "hex",
    } as GetBlockByHeightReturnType;
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

describe("getBlockByHeight", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetBlockByHeightParameters = {
      height: 1000001,
      encoding: "hex",
    };

    await getBlockByHeight(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "avm.getBlockByHeight",
      params: params,
    });
  });

  test("returns block data", async () => {
    const params: GetBlockByHeightParameters = {
      height: 1000001,
      encoding: "hex",
    };

    const result: GetBlockByHeightReturnType = await getBlockByHeight(
      client,
      params
    );
    expectTypeOf(result).toEqualTypeOf<GetBlockByHeightReturnType>();
    expect(result.block).toBe("0x1234567890abcdef");
    expect(result.encoding).toBe("hex");
  });
});
