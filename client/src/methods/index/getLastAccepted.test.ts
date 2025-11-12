import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getLastAccepted } from "./getLastAccepted.js";
import type {
  GetLastAcceptedParameters,
  GetLastAcceptedReturnType,
} from "./types/getLastAccepted.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "index.getLastAccepted") {
    return {
      id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
      bytes: "0x1234567890abcdef",
      timestamp: "2024-01-01T00:00:00Z",
      encoding: "hex",
      index: "0",
    } as GetLastAcceptedReturnType;
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

describe("getLastAccepted", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetLastAcceptedParameters = {
      encoding: "hex",
    };

    await getLastAccepted(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "index.getLastAccepted",
      params: params,
    });
  });

  test("returns last accepted container", async () => {
    const params: GetLastAcceptedParameters = {
      encoding: "hex",
    };

    const result: GetLastAcceptedReturnType = await getLastAccepted(
      client,
      params
    );
    expectTypeOf(result).toEqualTypeOf<GetLastAcceptedReturnType>();
    expect(result.id).toBe("6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY");
    expect(result.bytes).toBe("0x1234567890abcdef");
    expect(result.encoding).toBe("hex");
    expect(result.index).toBe("0");
  });
});
