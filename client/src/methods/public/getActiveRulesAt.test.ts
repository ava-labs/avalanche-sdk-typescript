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

  test("uses 'latest' as default when timestamp is undefined", async () => {
    const params: GetActiveRulesAtParameters = {} as any;

    await getActiveRulesAt(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "eth_getActiveRulesAt",
      params: ["latest"],
    });
  });

  test("uses 'latest' as default when timestamp is null", async () => {
    const params: GetActiveRulesAtParameters = {
      timestamp: null as any,
    };

    await getActiveRulesAt(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "eth_getActiveRulesAt",
      params: ["latest"],
    });
  });

  test("handles different timestamp values", async () => {
    const timestampValues = ["0x1", "0x100", "latest", "0xabc123", "0x0"];

    for (const timestamp of timestampValues) {
      vi.clearAllMocks();
      await getActiveRulesAt(client, { timestamp });

      expect(mockRequest).toHaveBeenCalledWith({
        method: "eth_getActiveRulesAt",
        params: [timestamp],
      });
    }
  });

  test("handles empty string timestamp", async () => {
    const params: GetActiveRulesAtParameters = {
      timestamp: "",
    };

    await getActiveRulesAt(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "eth_getActiveRulesAt",
      params: [""],
    });
  });

  test("validates return type structure with multiple rules", async () => {
    mockRequest.mockResolvedValueOnce({
      ethRules: {
        EIP155: true,
        EIP158: true,
      },
      avalancheRules: {
        ApricotPhase1: true,
        ApricotPhase2: true,
      },
      precompiles: {
        "0x0000000000000000000000000000000000000001": {
          enabled: true,
        },
      },
    } as any);

    const result: GetActiveRulesAtReturnType = await getActiveRulesAt(client, {
      timestamp: "0x1",
    });

    expectTypeOf(result).toEqualTypeOf<GetActiveRulesAtReturnType>();
    expect(result.ethRules).toBeDefined();
    expect(result.avalancheRules).toBeDefined();
    expect(result.precompiles).toBeDefined();
    expect(
      result.ethRules instanceof Map || typeof result.ethRules === "object"
    ).toBe(true);
    expect(
      result.avalancheRules instanceof Map ||
        typeof result.avalancheRules === "object"
    ).toBe(true);
    expect(
      result.precompiles instanceof Map ||
        typeof result.precompiles === "object"
    ).toBe(true);
  });
});
