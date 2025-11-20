import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getTx } from "./getTx.js";
import type { GetTxParameters, GetTxReturnType } from "./types/getTx.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getTx") {
    return {
      tx: "0x1234567890abcdef",
      encoding: "hex",
    } as GetTxReturnType;
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

describe("getTx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetTxParameters = {
      txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
      encoding: "hex",
    };

    await getTx(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getTx",
      params: params,
    });
  });

  test("returns transaction data", async () => {
    const params: GetTxParameters = {
      txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
      encoding: "hex",
    };

    const result = await getTx(client, params);
    expectTypeOf(result).toEqualTypeOf<GetTxReturnType>();
    expect(result.tx).toBe("0x1234567890abcdef");
    expect(result.encoding).toBe("hex");
  });
});
