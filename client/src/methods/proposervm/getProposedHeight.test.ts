import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getProposedHeight } from "./getProposedHeight.js";
import type { GetProposedHeightReturnType } from "./types/getProposedHeight.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "proposervm.getProposedHeight") {
    return {
      height: "100",
    } as GetProposedHeightReturnType;
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

describe("getProposedHeight", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await getProposedHeight(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "proposervm.getProposedHeight",
      params: {},
    });
  });

  test("returns proposed height", async () => {
    const result: GetProposedHeightReturnType = await getProposedHeight(client);
    expectTypeOf(result).toEqualTypeOf<GetProposedHeightReturnType>();
    expect(result.height).toBe("100");
  });
});
