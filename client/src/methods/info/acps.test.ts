import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { acps } from "./acps.js";
import type { AcpsReturnType } from "./types/acps.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "info.acps") {
    return {
      acps: {
        "1": {
          supportWeight: "1000000",
          supporters: ["NodeID-1", "NodeID-2"],
          objectWeight: "0",
          objectors: [],
          abstainWeight: "0",
        },
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

const client = createAvalancheBaseClient({
  chain: avalanche,
  transport: mockTransport,
});

describe("acps", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await acps(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "info.acps",
      params: {},
    });
  });

  test("returns ACP preferences", async () => {
    const result: AcpsReturnType = await acps(client);
    expectTypeOf(result).toEqualTypeOf<AcpsReturnType>();
    expect(result.acps).toBeDefined();
    expect(result.acps instanceof Map).toBe(true);
    expect(result.acps.get(1)).toBeDefined();
  });

  test("handles multiple ACP entries", async () => {
    mockRequest.mockResolvedValueOnce({
      acps: {
        1: {
          supportWeight: "1000000",
          supporters: ["NodeID-1"],
          objectWeight: "0",
          objectors: [],
          abstainWeight: "0",
        },
        2: {
          supportWeight: "2000000",
          supporters: ["NodeID-2", "NodeID-3"],
          objectWeight: "500000",
          objectors: ["NodeID-4"],
          abstainWeight: "100000",
        },
        3: {
          supportWeight: "0",
          supporters: [],
          objectWeight: "0",
          objectors: [],
          abstainWeight: "0",
        },
      } as any,
    });

    const result: AcpsReturnType = await acps(client);

    expect(result.acps.size).toBe(3);
    expect(result.acps.get(1)).toBeDefined();
    expect(result.acps.get(2)).toBeDefined();
    expect(result.acps.get(3)).toBeDefined();
    expect(result.acps.get(1)?.supportWeight).toBe(BigInt("1000000"));
    expect(result.acps.get(2)?.supportWeight).toBe(BigInt("2000000"));
    expect(result.acps.get(2)?.supporters.size).toBe(2);
    expect(result.acps.get(2)?.objectors.size).toBe(1);
  });

  test("handles missing optional fields with defaults", async () => {
    mockRequest.mockResolvedValueOnce({
      acps: {
        1: {
          // Missing supportWeight, supporters, objectWeight, objectors, abstainWeight
        },
      } as any,
    });

    const result: AcpsReturnType = await acps(client);

    const acp1 = result.acps.get(1);
    expect(acp1).toBeDefined();
    expect(acp1?.supportWeight).toBe(BigInt(0));
    expect(acp1?.supporters.size).toBe(0);
    expect(acp1?.objectWeight).toBe(BigInt(0));
    expect(acp1?.objectors.size).toBe(0);
    expect(acp1?.abstainWeight).toBe(BigInt(0));
  });

  test("handles partially missing fields", async () => {
    mockRequest.mockResolvedValueOnce({
      acps: {
        1: {
          supportWeight: "1000000",
          // Missing supporters
          objectWeight: "500000",
          // Missing objectors
          abstainWeight: "200000",
        },
      } as any,
    });

    const result: AcpsReturnType = await acps(client);

    const acp1 = result.acps.get(1);
    expect(acp1).toBeDefined();
    expect(acp1?.supportWeight).toBe(BigInt("1000000"));
    expect(acp1?.supporters.size).toBe(0); // Default to empty Set
    expect(acp1?.objectWeight).toBe(BigInt("500000"));
    expect(acp1?.objectors.size).toBe(0); // Default to empty Set
    expect(acp1?.abstainWeight).toBe(BigInt("200000"));
  });

  test("handles empty acps object", async () => {
    mockRequest.mockResolvedValueOnce({
      acps: {} as any,
    });

    const result: AcpsReturnType = await acps(client);

    expect(result.acps.size).toBe(0);
    expect(result.acps instanceof Map).toBe(true);
  });

  test("converts string keys to numeric keys correctly", async () => {
    mockRequest.mockResolvedValueOnce({
      acps: {
        0: {
          supportWeight: "0",
          supporters: [],
          objectWeight: "0",
          objectors: [],
          abstainWeight: "0",
        },
        10: {
          supportWeight: "1000000",
          supporters: ["NodeID-1"],
          objectWeight: "0",
          objectors: [],
          abstainWeight: "0",
        },
        999: {
          supportWeight: "2000000",
          supporters: ["NodeID-2"],
          objectWeight: "0",
          objectors: [],
          abstainWeight: "0",
        },
      } as any,
    });

    const result: AcpsReturnType = await acps(client);

    expect(result.acps.has(0)).toBe(true);
    expect(result.acps.has(10)).toBe(true);
    expect(result.acps.has(999)).toBe(true);
    expect(result.acps.get(0)?.supportWeight).toBe(BigInt(0));
    expect(result.acps.get(10)?.supportWeight).toBe(BigInt("1000000"));
    expect(result.acps.get(999)?.supportWeight).toBe(BigInt("2000000"));
  });

  test("converts supporters array to Set", async () => {
    mockRequest.mockResolvedValueOnce({
      acps: {
        1: {
          supportWeight: "1000000",
          supporters: ["NodeID-1", "NodeID-2", "NodeID-1"], // Duplicate to test Set
          objectWeight: "0",
          objectors: [],
          abstainWeight: "0",
        },
      },
    });

    const result: AcpsReturnType = await acps(client);

    const acp1 = result.acps.get(1);
    expect(acp1?.supporters instanceof Set).toBe(true);
    expect(acp1?.supporters.size).toBe(2); // Duplicates removed
    expect(acp1?.supporters.has("NodeID-1")).toBe(true);
    expect(acp1?.supporters.has("NodeID-2")).toBe(true);
  });

  test("converts objectors array to Set", async () => {
    mockRequest.mockResolvedValueOnce({
      acps: {
        "1": {
          supportWeight: "0",
          supporters: [],
          objectWeight: "500000",
          objectors: ["NodeID-3", "NodeID-4", "NodeID-3"] as any, // Duplicate to test Set
          abstainWeight: "0",
        },
      } as any,
    });

    const result: AcpsReturnType = await acps(client);

    const acp1 = result.acps.get(1);
    expect(acp1?.objectors instanceof Set).toBe(true);
    expect(acp1?.objectors.size).toBe(2); // Duplicates removed
    expect(acp1?.objectors.has("NodeID-3")).toBe(true);
    expect(acp1?.objectors.has("NodeID-4")).toBe(true);
  });

  test("converts weight strings to BigInt", async () => {
    mockRequest.mockResolvedValueOnce({
      acps: {
        "1": {
          supportWeight: "1000000000000000000",
          supporters: [],
          objectWeight: "500000000000000000",
          objectors: [],
          abstainWeight: "250000000000000000",
        },
      },
    });

    const result: AcpsReturnType = await acps(client);

    const acp1 = result.acps.get(1);
    expect(acp1?.supportWeight).toBe(BigInt("1000000000000000000"));
    expect(acp1?.objectWeight).toBe(BigInt("500000000000000000"));
    expect(acp1?.abstainWeight).toBe(BigInt("250000000000000000"));
    expect(typeof acp1?.supportWeight).toBe("bigint");
    expect(typeof acp1?.objectWeight).toBe("bigint");
    expect(typeof acp1?.abstainWeight).toBe("bigint");
  });
});
