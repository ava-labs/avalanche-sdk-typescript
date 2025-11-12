import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { sampleValidators } from "./sampleValidators.js";
import type {
  SampleValidatorsParameters,
  SampleValidatorsReturnType,
} from "./types/sampleValidators.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.sampleValidators") {
    return {
      validators: [
        "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
        "NodeID-111111111111111111111111111111111111111",
      ],
    } as SampleValidatorsReturnType;
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

describe("sampleValidators", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: SampleValidatorsParameters = {
      size: 2,
      subnetID: "11111111111111111111111111111111LpoYY",
    };

    await sampleValidators(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.sampleValidators",
      params: params,
    });
  });

  test("returns sampled validators", async () => {
    const params: SampleValidatorsParameters = {
      size: 2,
      subnetID: "11111111111111111111111111111111LpoYY",
    };

    const result = await sampleValidators(client, params);
    expectTypeOf(result).toEqualTypeOf<SampleValidatorsReturnType>();
    expect(result.validators).toBeDefined();
    expect(result.validators.length).toBe(2);
    expect(result.validators[0]).toBe(
      "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg"
    );
  });
});
