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
  if (method === "platform.getUTXOs") {
    return {
      numFetched: 2,
      utxos: [
        "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
      ],
      endIndex: {
        address: "P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy",
        utxo: "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
      },
      sourceChain: "X",
      encoding: "hex",
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
      addresses: ["P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
      sourceChain: "X",
    };

    await getUTXOs(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getUTXOs",
      params: params,
    });
  });

  test("returns UTXOs", async () => {
    const params: GetUTXOsParameters = {
      addresses: ["P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
      sourceChain: "X",
    };

    const result = await getUTXOs(client, params);
    expectTypeOf(result).toEqualTypeOf<GetUTXOsReturnType>();
    expect(result.numFetched).toBe(2);
    expect(result.utxos).toBeDefined();
    expect(result.endIndex).toBeDefined();
    expect(result.encoding).toBe("hex");
    expect(result.sourceChain).toBe("X");
  });
});
