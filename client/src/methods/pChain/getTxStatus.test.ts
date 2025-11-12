import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import { getTxStatus } from "./getTxStatus.js";
import type {
  GetTxStatusParameters,
  GetTxStatusReturnType,
} from "./types/getTxStatus.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "platform.getTxStatus") {
    return { status: "Pending" } as GetTxStatusReturnType;
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

describe("getTxStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and params", async () => {
    const params: GetTxStatusParameters = {
      txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
    };

    await getTxStatus(client, params);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "platform.getTxStatus",
      params: params,
    });
  });

  test("returns transaction status", async () => {
    const params: GetTxStatusParameters = {
      txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
    };

    const result = await getTxStatus(client, params);
    expect(result.status).toBe("Pending");
  });
});
