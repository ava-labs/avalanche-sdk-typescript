import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getBlockchains } from "./getBlockchains.js";
import { GetBlockchainsReturnType } from "./types/getBlockchains.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getBlockchains") {
    return {
      blockchains: [
        {
          id: "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
          name: "X-Chain",
          subnetID: "11111111111111111111111111111111LpoYY",
          vmID: "jvYyfQTxGMJLuGWa55kdP2p2zSUYsQ5RaRp4ZbTQeS3qkK6y",
        },
      ],
    } as GetBlockchainsReturnType;
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

describe("getBlockchains", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    await getBlockchains(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getBlockchains",
      params: {},
    });
  });

  test("returns blockchains", async () => {
    const result = await getBlockchains(client);
    expectTypeOf(result).toEqualTypeOf<GetBlockchainsReturnType>();
    expect(result.blockchains).toBeDefined();
    expect(result.blockchains.length).toBe(1);
    expect(result.blockchains[0].name).toBe("X-Chain");
  });
});
