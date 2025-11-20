import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getNodeVersion } from "./getNodeVersion.js";
import type { GetNodeVersionReturnType } from "./types/getNodeVersion.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "info.getNodeVersion") {
    return {
      version: "v1.0.0",
      databaseVersion: "v1.0.0",
      gitCommit: "abc123",
      vmVersions: new Map([["avm", "v1.0.0"]]),
      rpcProtocolVersion: "v1.0.0",
    } as GetNodeVersionReturnType;
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

describe("getNodeVersion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await getNodeVersion(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "info.getNodeVersion",
      params: {},
    });
  });

  test("returns node version", async () => {
    const result: GetNodeVersionReturnType = await getNodeVersion(client);
    expectTypeOf(result).toEqualTypeOf<GetNodeVersionReturnType>();
    expect(result.version).toBe("v1.0.0");
    expect(result.databaseVersion).toBe("v1.0.0");
    expect(result.gitCommit).toBe("abc123");
    expect(result.rpcProtocolVersion).toBe("v1.0.0");
  });
});
