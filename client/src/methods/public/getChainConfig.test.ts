import { createClient, createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { getChainConfig } from "./getChainConfig.js";
import type { GetChainConfigReturnType } from "./types/getChainConfig.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "eth_getChainConfig") {
    return {
      chainId: 43114,
      homesteadBlock: 0,
      daoForkBlock: 0,
      daoForkSupport: false,
      eip150Block: 0,
      eip150Hash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      eip155Block: 0,
      eip158Block: 0,
      byzantiumBlock: 0,
      constantinopleBlock: 0,
      petersburgBlock: 0,
      istanbulBlock: 0,
      muirGlacierBlock: 0,
      apricotPhase1BlockTimestamp: 0,
      apricotPhase2BlockTimestamp: 0,
      apricotPhase3BlockTimestamp: 0,
      apricotPhase4BlockTimestamp: 0,
      apricotPhase5BlockTimestamp: 0,
    } as GetChainConfigReturnType;
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

describe("getChainConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await getChainConfig(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "eth_getChainConfig",
      params: [],
    });
  });

  test("returns chain config", async () => {
    const result: GetChainConfigReturnType = await getChainConfig(client);
    expectTypeOf(result).toEqualTypeOf<GetChainConfigReturnType>();
    expect(result.chainId).toBe(43114);
    expect(result.homesteadBlock).toBe(0);
  });
});
