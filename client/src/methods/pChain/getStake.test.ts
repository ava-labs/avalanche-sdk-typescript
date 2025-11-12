import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getStake } from "./getStake.js";
import type {
  GetStakeParameters,
  GetStakeReturnType,
} from "./types/getStake.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getStake") {
    return {
      staked: BigInt("1000000000000000000"),
      stakeds: {
        "P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy": BigInt(
          "1000000000000000000"
        ),
      },
      stakedOutputs: ["0x1234567890abcdef"],
      encoding: "hex" as const,
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

describe("getStake", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetStakeParameters = {
      addresses: ["P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
      validatorsOnly: true,
    };

    await getStake(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getStake",
      params: params,
    });
  });

  test("returns stake", async () => {
    const params: GetStakeParameters = {
      addresses: ["P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
      validatorsOnly: true,
    };

    const result = await getStake(client, params);
    expectTypeOf(result).toEqualTypeOf<GetStakeReturnType>();
    expect(result.staked).toBeDefined();
    expect(
      result.stakeds["P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"]
    ).toBe(BigInt("1000000000000000000"));
    expect(result.stakeds).toBeDefined();
    expect(
      result.stakeds["P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"]
    ).toBe(BigInt("1000000000000000000"));
    expect(result.stakedOutputs).toBeDefined();
    expect(result.stakedOutputs[0]).toBe("0x1234567890abcdef");
    expect(result.encoding).toBe("hex" as const);
  });
});
