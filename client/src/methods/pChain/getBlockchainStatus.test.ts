import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getBlockchainStatus } from "./getBlockchainStatus.js";
import type {
  GetBlockchainStatusParameters,
  GetBlockchainStatusReturnType,
} from "./types/getBlockchainStatus.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getBlockchainStatus") {
    return { status: "Validating" } as GetBlockchainStatusReturnType;
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

describe("getBlockchainStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetBlockchainStatusParameters = {
      blockchainId: "11111111111111111111111111111111LpoYY",
    };

    await getBlockchainStatus(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getBlockchainStatus",
      params: params,
    });
  });

  test("returns blockchain status", async () => {
    const params: GetBlockchainStatusParameters = {
      blockchainId: "11111111111111111111111111111111LpoYY",
    };

    const result = await getBlockchainStatus(client, params);
    expectTypeOf(result).toEqualTypeOf<GetBlockchainStatusReturnType>();
    expect(result.status).toBe("Validating");
  });
});
