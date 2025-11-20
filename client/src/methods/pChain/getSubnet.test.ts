import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getSubnet } from "./getSubnet.js";
import type {
  GetSubnetParameters,
  GetSubnetReturnType,
} from "./types/getSubnet.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getSubnet") {
    return {
      subnetID: "11111111111111111111111111111111LpoYY",
      controlKeys: ["P-avax1gss39m5sx6jn7wlyzeqzm086yfq2l02xkvmecy"],
      isPermissioned: true,
      threshold: "1",
      locktime: "1",
      subnetTransformationTxID: "1",
      conversionID: "1",
      managerChainID: "1",
      managerAddress: "P-avax1gss39m5sx6jn7wlyzeqzm086yfq2l02xkvmecy",
    } as GetSubnetReturnType;
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

describe("getSubnet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetSubnetParameters = {
      subnetID: "11111111111111111111111111111111LpoYY",
    };

    await getSubnet(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getSubnet",
      params: params,
    });
  });

  test("returns subnet information", async () => {
    const params: GetSubnetParameters = {
      subnetID: "11111111111111111111111111111111LpoYY",
    };

    const result = await getSubnet(client, params);
    expectTypeOf(result).toEqualTypeOf<GetSubnetReturnType>();
    expect(result.isPermissioned).toBe(true);
    expect(result.controlKeys).toBeDefined();
    expect(Object.keys(result.controlKeys).length).toBe(1);
    expect(result.controlKeys.length).toBe(1);
    expect(result.threshold).toBe("1");
    expect(result.locktime).toBe("1");
    expect(result.subnetTransformationTxID).toBe("1");
    expect(result.conversionID).toBe("1");
    expect(result.managerChainID).toBe("1");
    expect(result.managerAddress).toBe(
      "P-avax1gss39m5sx6jn7wlyzeqzm086yfq2l02xkvmecy"
    );
  });
});
