import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { readiness } from "./readiness.js";
import type {
  ReadinessParameters,
  ReadinessReturnType,
} from "./types/readiness.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "health.readiness") {
    return {
      healthy: true,
      checks: {
        C: {
          message: {
            timestamp: "2024-01-01T00:00:00Z",
            duration: 10,
            contiguousFailures: 0,
            timeOfFirstFailure: null,
          },
          healthy: true,
        },
        P: {
          message: {
            timestamp: "2024-01-01T00:00:00Z",
            duration: 10,
            contiguousFailures: 0,
            timeOfFirstFailure: null,
          },
          healthy: true,
        },
        X: {
          message: {
            timestamp: "2024-01-01T00:00:00Z",
            duration: 10,
            contiguousFailures: 0,
            timeOfFirstFailure: null,
          },
          healthy: true,
        },
      },
    } as ReadinessReturnType;
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

describe("readiness", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: ReadinessParameters = {
      tags: ["11111111111111111111111111111111LpoYY"],
    };

    await readiness(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "health.readiness",
      params: params,
    });
  });

  test("returns readiness status", async () => {
    const params: ReadinessParameters = {
      tags: ["11111111111111111111111111111111LpoYY"],
    };

    const result: ReadinessReturnType = await readiness(client, params);
    expectTypeOf(result).toEqualTypeOf<ReadinessReturnType>();
    expect(result.healthy).toBe(true);
    expect(result.checks).toBeDefined();
    expect(result.checks.C).toBeDefined();
    expect(result.checks.P).toBeDefined();
    expect(result.checks.X).toBeDefined();
  });

  test("handles optional tags parameter", async () => {
    const params: ReadinessParameters = {};

    await readiness(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "health.readiness",
      params: {},
    });
  });
});
