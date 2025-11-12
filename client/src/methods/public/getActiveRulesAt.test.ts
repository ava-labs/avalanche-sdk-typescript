import { createClient, createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { getActiveRulesAt } from "./getActiveRulesAt.js";
import type {
  GetActiveRulesAtParameters,
  GetActiveRulesAtReturnType,
} from "./types/getActiveRulesAt.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "eth_getActiveRulesAt") {
    return {
      ethRules: {
        EIP155: true,
        EIP158: true,
      },
      avalancheRules: {
        ApricotPhase1: true,
        ApricotPhase2: true,
      },
      precompiles: {
        "0x0000000000000000000000000000000000000001": {},
      },
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

const client = createClient({
  chain: avalanche,
  transport: mockTransport,
});

describe("getActiveRulesAt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetActiveRulesAtParameters = {
      timestamp: "0x1",
    };

    await getActiveRulesAt(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "eth_getActiveRulesAt",
      params: ["0x1"],
    });
  });

  test("returns active rules", async () => {
    const params: GetActiveRulesAtParameters = {
      timestamp: "0x1",
    };

    const result: GetActiveRulesAtReturnType = await getActiveRulesAt(
      client,
      params
    );
    expectTypeOf(result).toEqualTypeOf<GetActiveRulesAtReturnType>();
    expect(result.ethRules).toBeDefined();
    expect(result.avalancheRules).toBeDefined();
    expect(result.precompiles).toBeDefined();
  });
});
