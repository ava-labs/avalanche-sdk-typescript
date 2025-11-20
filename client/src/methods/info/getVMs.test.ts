import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getVMs } from "./getVMs.js";
import type { GetVMsReturnType } from "./types/getVMs.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "info.getVMs") {
    return {
      vms: {
        rWmY6Sh7P9mjQoTfXd89un7WoroFezFXp: ["vm1", "vm2"],
      },
    } as GetVMsReturnType;
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

describe("getVMs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await getVMs(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "info.getVMs",
      params: {},
    });
  });

  test("returns VMs", async () => {
    const result: GetVMsReturnType = await getVMs(client);
    expectTypeOf(result).toEqualTypeOf<GetVMsReturnType>();
    expect(result.vms).toBeDefined();
    expect(result.vms["rWmY6Sh7P9mjQoTfXd89un7WoroFezFXp"]).toEqual([
      "vm1",
      "vm2",
    ]);
  });
});
