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
});
