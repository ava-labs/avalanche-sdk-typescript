import { createClient, createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { feeConfig } from "./feeConfig.js";
import type {
  FeeConfigParameters,
  FeeConfigReturnType,
} from "./types/feeConfig.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "eth_feeConfig") {
    return {
      feeConfig: {
        gasLimit: "0x5208",
        targetBlockRate: "0x2",
      },
      lastChangedAt: "1000000",
    } as FeeConfigReturnType;
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

const client = createClient({
  chain: avalanche,
  transport: mockTransport,
});

describe("feeConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: FeeConfigParameters = {
      blk: "0x1",
    };

    await feeConfig(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "eth_feeConfig",
      params: ["0x1"],
    });
  });

  test("returns fee config", async () => {
    const params: FeeConfigParameters = {
      blk: "0x1",
    };

    const result: FeeConfigReturnType = await feeConfig(client, params);
    expectTypeOf(result).toEqualTypeOf<FeeConfigReturnType>();
    expect(result.feeConfig).toBeDefined();
    expect(result.lastChangedAt).toBe("1000000");
  });

  test("uses 'latest' as default when blk is undefined", async () => {
    const params: FeeConfigParameters = {} as any;

    await feeConfig(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "eth_feeConfig",
      params: ["latest"],
    });
  });

  test("uses 'latest' as default when blk is not provided", async () => {
    const params: FeeConfigParameters = {} as any;

    await feeConfig(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "eth_feeConfig",
      params: ["latest"],
    });
  });

  test("handles different block values", async () => {
    const blockValues = ["0x1", "0x100", "latest", "0xabc123"];

    for (const blk of blockValues) {
      vi.clearAllMocks();
      await feeConfig(client, { blk });

      expect(mockRequest).toHaveBeenCalledWith({
        method: "eth_feeConfig",
        params: [blk],
      });
    }
  });

  test("handles null blk value", async () => {
    const params: FeeConfigParameters = {
      blk: null as any,
    };

    await feeConfig(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "eth_feeConfig",
      params: ["latest"],
    });
  });
});
