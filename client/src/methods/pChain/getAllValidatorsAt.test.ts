import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getAllValidatorsAt } from "./getAllValidatorsAt.js";
import type {
  GetAllValidatorsAtParameters,
  GetAllValidatorsAtReturnType,
} from "./types/getAllValidatorsAt.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getAllValidatorsAt") {
    return {
      validatorSets: {
        "11111111111111111111111111111111LpoYY": {
          validators: [
            {
              publicKey: "0x1234567890abcdef",
              weight: "1000000000000",
              nodeIDs: ["NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg"],
            },
          ],
          totalWeight: "1000000000000",
        },
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

describe("getAllValidatorsAt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetAllValidatorsAtParameters = {
      height: 1000001,
    };

    await getAllValidatorsAt(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getAllValidatorsAt",
      params: params,
    });
  });

  test("returns validators", async () => {
    const params: GetAllValidatorsAtParameters = {
      height: 1000001,
    };

    const result: GetAllValidatorsAtReturnType = await getAllValidatorsAt(
      client,
      params
    );
    expectTypeOf(result).toMatchObjectType<GetAllValidatorsAtReturnType>();
    expect(result.validatorSets).toBeDefined();
    expect(Object.keys(result.validatorSets).length).toBe(1);
    expect(
      result.validatorSets["11111111111111111111111111111111LpoYY"].validators
    ).toBeDefined();
    expect(
      result.validatorSets["11111111111111111111111111111111LpoYY"]
        .validators[0].weight
    ).toBe("1000000000000");
    expect(
      result.validatorSets["11111111111111111111111111111111LpoYY"].totalWeight
    ).toBe("1000000000000");
  });
});
