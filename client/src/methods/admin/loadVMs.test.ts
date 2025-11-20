import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { loadVMs } from "./loadVMs.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "admin.loadVMs") {
    return {
      newVMs: {
        rWmY6Sh7P9mjQoTfXd89un7WoroFezFXp: ["vm1", "vm2"],
        tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH: ["vm3"],
      },
      failedVMs: {
        failedVM1: "Failed to load: missing dependencies",
      },
    };
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

describe("loadVMs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await loadVMs(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "admin.loadVMs",
      params: {},
    });
  });

  test("returns VMs data", async () => {
    const result = await loadVMs(client);
    expect(result).toEqual({
      newVMs: {
        rWmY6Sh7P9mjQoTfXd89un7WoroFezFXp: ["vm1", "vm2"],
        tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH: ["vm3"],
      },
      failedVMs: {
        failedVM1: "Failed to load: missing dependencies",
      },
    });
  });
});
