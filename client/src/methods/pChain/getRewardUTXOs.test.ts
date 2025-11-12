import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getRewardUTXOs } from "./getRewardUTXOs.js";
import type {
  GetRewardUTXOsParameters,
  GetRewardUTXOsReturnType,
} from "./types/getRewardUTXOs.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getRewardUTXOs") {
    return {
      numFetched: 1,
      utxos: [
        "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
      ],
      encoding: "hex",
    } as GetRewardUTXOsReturnType;
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

describe("getRewardUTXOs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetRewardUTXOsParameters = {
      txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
      encoding: "hex",
    };

    await getRewardUTXOs(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getRewardUTXOs",
      params: params,
    });
  });

  test("returns reward UTXOs", async () => {
    const params: GetRewardUTXOsParameters = {
      txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
      encoding: "hex",
    };

    const result = await getRewardUTXOs(client, params);
    expectTypeOf(result).toEqualTypeOf<GetRewardUTXOsReturnType>();
    expect(result.numFetched).toBe(1);
    expect(result.utxos).toBeDefined();
    expect(result.encoding).toBe("hex");
  });
});
