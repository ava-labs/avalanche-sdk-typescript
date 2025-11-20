import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getNodeID } from "./getNodeID.js";
import type { GetNodeIDReturnType } from "./types/getNodeID.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "info.getNodeID") {
    return {
      nodeID: "NodeID-11111111111111111111111111111111",
      nodePOP: {
        publicKey: "0x1234567890abcdef",
        proofOfPossession: "0xabcdef1234567890",
      },
    } as GetNodeIDReturnType;
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

describe("getNodeID", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await getNodeID(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "info.getNodeID",
      params: {},
    });
  });

  test("returns node ID", async () => {
    const result: GetNodeIDReturnType = await getNodeID(client);
    expectTypeOf(result).toEqualTypeOf<GetNodeIDReturnType>();
    expect(result.nodeID).toBe("NodeID-11111111111111111111111111111111");
    expect(result.nodePOP.publicKey).toBe("0x1234567890abcdef");
    expect(result.nodePOP.proofOfPossession).toBe("0xabcdef1234567890");
  });
});
