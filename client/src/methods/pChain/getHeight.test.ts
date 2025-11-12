import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getHeight } from "./getHeight.js";
import { GetHeightReturnType } from "./types/getHeight.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getHeight") {
    return { height: 12345 };
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

describe("getHeight", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    await getHeight(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getHeight",
      params: {},
    });
  });

  test("returns height", async () => {
    const result = await getHeight(client);
    expectTypeOf(result).toEqualTypeOf<GetHeightReturnType>();
    expect(result.height).toBe(12345);
  });
});
