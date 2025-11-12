import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getContainerByID } from "./getContainerByID.js";
import type {
  GetContainerByIDParameters,
  GetContainerByIDReturnType,
} from "./types/getContainerByID.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "index.getContainerByID") {
    return {
      id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
      bytes: "0x1234567890abcdef",
      timestamp: "2024-01-01T00:00:00Z",
      encoding: "hex",
      index: "0",
    } as GetContainerByIDReturnType;
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

describe("getContainerByID", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetContainerByIDParameters = {
      id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
      encoding: "hex",
    };

    await getContainerByID(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "index.getContainerByID",
      params: params,
    });
  });

  test("returns container details", async () => {
    const params: GetContainerByIDParameters = {
      id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
      encoding: "hex",
    };

    const result: GetContainerByIDReturnType = await getContainerByID(
      client,
      params
    );
    expectTypeOf(result).toEqualTypeOf<GetContainerByIDReturnType>();
    expect(result.id).toBe("6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY");
    expect(result.bytes).toBe("0x1234567890abcdef");
    expect(result.encoding).toBe("hex");
    expect(result.index).toBe("0");
  });
});
