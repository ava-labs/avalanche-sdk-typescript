import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getL1Validator } from "./getL1Validator.js";
import type {
  GetL1ValidatorParameters,
  GetL1ValidatorReturnType,
} from "./types/getL1Validator.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getL1Validator") {
    return {
      nodeID: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
      startTime: "1678886400",
      weight: "1000000000000",
      minNonce: "100",
      balance: "500000000000",
      height: "1000000",
      subnetID: "11111111111111111111111111111111LpoYY",
      publicKey: "0x1234567890abcdef",
      remainingBalanceOwner: {
        addresses: ["P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
        locktime: "1678886400",
        threshold: "1",
      },
      deactivationOwner: {
        addresses: ["P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
        locktime: "1678886400",
        threshold: "1",
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

describe("getL1Validator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetL1ValidatorParameters = {
      validationID: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
    };

    await getL1Validator(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getL1Validator",
      params: params,
    });
  });

  test("returns L1 validator with BigInt values", async () => {
    const params: GetL1ValidatorParameters = {
      validationID: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
    };

    const result: GetL1ValidatorReturnType = await getL1Validator(
      client,
      params
    );
    expectTypeOf(result).toEqualTypeOf<GetL1ValidatorReturnType>();
    expect(result.nodeID).toBe("NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg");
    expect(result.startTime).toBe(BigInt("1678886400"));
    expect(result.weight).toBe(BigInt("1000000000000"));
    expect(result.minNonce).toBe(BigInt("100"));
    expect(result.balance).toBe(BigInt("500000000000"));
    expect(result.height).toBe(BigInt("1000000"));
  });
});
