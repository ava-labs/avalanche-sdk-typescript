import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { lockProfile } from "./lockProfile.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "admin.lockProfile") {
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

describe("lockProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await lockProfile(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "admin.lockProfile",
      params: {},
    });
  });

  test("returns void", async () => {
    const result = await lockProfile(client);
    expect(result).toBeUndefined();
  });
});
