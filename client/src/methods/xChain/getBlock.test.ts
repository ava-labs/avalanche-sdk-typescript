import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getBlock } from "./getBlock.js";
import type {
  GetBlockParameters,
  GetBlockReturnType,
} from "./types/getBlock.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "avm.getBlock") {
    return {
      block: "0x1234567890abcdef",
      encoding: "hex",
    } as GetBlockReturnType;
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

describe("getBlock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetBlockParameters = {
      blockId: "d7WYmb8VeZNHsny3EJCwMm6QA37s1EHwMxw1Y71V3FqPZ5EFG",
      encoding: "hex",
    };

    await getBlock(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "avm.getBlock",
      params: params,
    });
  });

  test("returns block data", async () => {
    const params: GetBlockParameters = {
      blockId: "d7WYmb8VeZNHsny3EJCwMm6QA37s1EHwMxw1Y71V3FqPZ5EFG",
      encoding: "hex",
    };

    const result: GetBlockReturnType = await getBlock(client, params);
    expectTypeOf(result).toEqualTypeOf<GetBlockReturnType>();
    expect(result.block).toBe("0x1234567890abcdef");
    expect(result.encoding).toBe("hex");
  });
});
