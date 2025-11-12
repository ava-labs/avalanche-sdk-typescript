import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { peers } from "./peers.js";
import type { PeersParameters, PeersReturnType } from "./types/peers.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "info.peers") {
    return {
      numPeers: 1,
      peers: [
        {
          ip: "127.0.0.1",
          publicIP: "127.0.0.1",
          nodeID: "NodeID-11111111111111111111111111111111",
          version: "v1.0.0",
          lastSent: "2024-01-01T00:00:00Z",
          lastReceived: "2024-01-01T00:00:00Z",
          benched: [],
          observedUptime: 100,
        },
      ],
    } as PeersReturnType;
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

describe("peers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: PeersParameters = {
      nodeIDs: [],
    };

    await peers(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "info.peers",
      params: params,
    });
  });

  test("returns peers information", async () => {
    const params: PeersParameters = {
      nodeIDs: [],
    };

    const result: PeersReturnType = await peers(client, params);
    expectTypeOf(result).toEqualTypeOf<PeersReturnType>();
    expect(result.numPeers).toBe(1);
    expect(result.peers).toBeDefined();
    expect(result.peers.length).toBe(1);
  });

  test("handles optional nodeIDs parameter", async () => {
    const params: PeersParameters = {};

    await peers(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "info.peers",
      params: {},
    });
  });
});
