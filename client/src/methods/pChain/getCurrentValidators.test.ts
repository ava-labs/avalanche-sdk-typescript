import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getCurrentValidators } from "./getCurrentValidators.js";
import type {
  GetCurrentValidatorsParameters,
  GetCurrentValidatorsReturnType,
} from "./types/getCurrentValidators.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getCurrentValidators") {
    return {
      validators: [
        {
          txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
          startTime: "1678886400",
          endTime: "1700422400",
          weight: "1000000000000",
          nodeID: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
          stakeAmount: "1000000000000",
          accruedDelegateeReward: "1000000000000",
          validationRewardOwner: {
            locktime: "1678886400",
            threshold: "1",
            addresses: ["P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
          },
          delegationRewardOwner: {
            locktime: "1678886400",
            threshold: "1",
            addresses: ["P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
          },
        },
      ],
    } as GetCurrentValidatorsReturnType;
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

describe("getCurrentValidators", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetCurrentValidatorsParameters = {
      subnetID: "11111111111111111111111111111111LpoYY",
    };

    await getCurrentValidators(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getCurrentValidators",
      params: params,
    });
  });

  test("returns validators", async () => {
    const params: GetCurrentValidatorsParameters = {
      subnetID: "11111111111111111111111111111111LpoYY",
    };

    const result = await getCurrentValidators(client, params);
    expectTypeOf(result).toEqualTypeOf<GetCurrentValidatorsReturnType>();
    expect(result.validators).toBeDefined();
    expect(result.validators.length).toBe(1);
    expect(result.validators[0].nodeID).toBe(
      "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg"
    );
  });
});
