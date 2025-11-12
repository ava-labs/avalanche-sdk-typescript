import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getSubnets } from "./getSubnets.js";
import type {
  GetSubnetsParameters,
  GetSubnetsReturnType,
} from "./types/getSubnets.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getSubnets") {
    return {
      subnets: [
        {
          id: "11111111111111111111111111111111LpoYY",
          controlKeys: ["P-avax1gss39m5sx6jn7wlyzeqzm086yfq2l02xkvmecy"],
          threshold: "1",
        },
      ],
    } as GetSubnetsReturnType;
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

describe("getSubnets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetSubnetsParameters = {
      ids: ["11111111111111111111111111111111LpoYY"],
    };

    await getSubnets(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getSubnets",
      params: params,
    });
  });

  test("returns subnets", async () => {
    const params: GetSubnetsParameters = {
      ids: ["11111111111111111111111111111111LpoYY"],
    };

    const result = await getSubnets(client, params);
    expectTypeOf(result).toEqualTypeOf<GetSubnetsReturnType>();
    expect(result.subnets).toBeDefined();
    expect(result.subnets.length).toBe(1);
    expect(result.subnets[0].id).toBe("11111111111111111111111111111111LpoYY");
  });
});
