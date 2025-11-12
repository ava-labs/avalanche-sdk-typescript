import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getUTXOs } from "./getUTXOs.js";
import type {
  GetUTXOsParameters,
  GetUTXOsReturnType,
} from "./types/getUTXOs.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "avax.getUTXOs") {
    return {
      numFetched: 1,
      utxos: ["0x1234567890abcdef"],
      endIndex: {
        address: "X-avax1wstkjcj4z8n0n6utxmcxap6mn9nrdz5k0v3fjh",
        utxo: "0",
      },
    } as GetUTXOsReturnType;
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

describe("getUTXOs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetUTXOsParameters = {
      addresses: ["X-avax1wstkjcj4z8n0n6utxmcxap6mn9nrdz5k0v3fjh"],
      limit: 100,
    };

    await getUTXOs(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "avax.getUTXOs",
      params: params,
    });
  });

  test("returns UTXOs", async () => {
    const params: GetUTXOsParameters = {
      addresses: ["X-avax1wstkjcj4z8n0n6utxmcxap6mn9nrdz5k0v3fjh"],
      limit: 100,
    };

    const result: GetUTXOsReturnType = await getUTXOs(client, params);
    expectTypeOf(result).toEqualTypeOf<GetUTXOsReturnType>();
    expect(result.numFetched).toBe(1);
    expect(result.utxos).toBeDefined();
    expect(result.utxos.length).toBe(1);
  });
});
