import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { memoryProfile } from "./memoryProfile.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "admin.memoryProfile") {
    return undefined;
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

describe("memoryProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await memoryProfile(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "admin.memoryProfile",
      params: {},
    });
  });

  test("returns void", async () => {
    const result = await memoryProfile(client);
    expect(result).toBeUndefined();
  });
});
