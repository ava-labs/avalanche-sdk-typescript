import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { health } from "./health.js";
import type { HealthParameters, HealthReturnType } from "./types/health.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "health.health") {
    return {
      healthy: true,
      checks: {
        C: {
          message: {
            engine: {
              consensus: {
                lastAcceptedHeight: 100,
                lastAcceptedID: "11111111111111111111111111111111LpoYY",
                longestProcessingBlock: "",
                processingBlocks: 0,
              },
              vm: null,
            },
            networking: {
              percentConnected: 100,
            },
          },
          timestamp: "2024-01-01T00:00:00Z",
          duration: 10,
        },
        P: {
          message: {
            engine: {
              consensus: {
                lastAcceptedHeight: 100,
                lastAcceptedID: "11111111111111111111111111111111LpoYY",
                longestProcessingBlock: "",
                processingBlocks: 0,
              },
              vm: null,
            },
            networking: {
              percentConnected: 100,
            },
          },
          timestamp: "2024-01-01T00:00:00Z",
          duration: 10,
        },
        X: {
          message: {
            engine: {
              consensus: {
                lastAcceptedHeight: 100,
                lastAcceptedID: "11111111111111111111111111111111LpoYY",
                longestProcessingBlock: "",
                processingBlocks: 0,
              },
              vm: null,
            },
            networking: {
              percentConnected: 100,
            },
          },
          timestamp: "2024-01-01T00:00:00Z",
          duration: 10,
        },
        bootstrapped: {
          message: [],
          timestamp: "2024-01-01T00:00:00Z",
          duration: 5,
        },
        database: {
          timestamp: "2024-01-01T00:00:00Z",
          duration: 2,
        },
        diskspace: {
          message: {
            availableDiskBytes: 1000000000,
          },
          timestamp: "2024-01-01T00:00:00Z",
          duration: 1,
        },
        network: {
          message: {
            connectedPeers: 10,
            sendFailRate: 0,
            timeSinceLastMsgReceived: "1s",
            timeSinceLastMsgSent: "1s",
          },
          timestamp: "2024-01-01T00:00:00Z",
          duration: 3,
        },
        router: {
          message: {
            longestRunningRequest: "",
            outstandingRequests: 0,
          },
          timestamp: "2024-01-01T00:00:00Z",
          duration: 1,
        },
      },
    } as HealthReturnType;
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

describe("health", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: HealthParameters = {
      tags: ["11111111111111111111111111111111LpoYY"],
    };

    await health(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "health.health",
      params: params,
    });
  });

  test("returns health status", async () => {
    const params: HealthParameters = {
      tags: ["11111111111111111111111111111111LpoYY"],
    };

    const result: HealthReturnType = await health(client, params);
    expectTypeOf(result).toEqualTypeOf<HealthReturnType>();
    expect(result.healthy).toBe(true);
    expect(result.checks).toBeDefined();
    expect(result.checks.C).toBeDefined();
    expect(result.checks.P).toBeDefined();
    expect(result.checks.X).toBeDefined();
  });

  test("handles optional tags parameter", async () => {
    const params: HealthParameters = {};

    await health(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "health.health",
      params: {},
    });
  });
});
