import { createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../../clients/createAvalancheBaseClient.js";
import type { UpgradesReturnType } from "./types/upgrades.js";
import { upgrades } from "./upgrades.js";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "info.upgrades") {
    return {
      apricotPhase1Time: "2024-01-01T00:00:00Z",
      apricotPhase2Time: "2024-01-01T00:00:00Z",
      apricotPhase3Time: "2024-01-01T00:00:00Z",
      apricotPhase4Time: "2024-01-01T00:00:00Z",
      apricotPhase4MinPChainHeight: 0,
      apricotPhase5Time: "2024-01-01T00:00:00Z",
      apricotPhasePre6Time: "2024-01-01T00:00:00Z",
      apricotPhase6Time: "2024-01-01T00:00:00Z",
      apricotPhasePost6Time: "2024-01-01T00:00:00Z",
      banffTime: "2024-01-01T00:00:00Z",
      cortinaTime: "2024-01-01T00:00:00Z",
      cortinaXChainStopVertexID: "vertex123",
      durangoTime: "2024-01-01T00:00:00Z",
      etnaTime: "2024-01-01T00:00:00Z",
    } as UpgradesReturnType;
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

describe("upgrades", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await upgrades(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "info.upgrades",
      params: {},
    });
  });

  test("returns upgrade information", async () => {
    const result: UpgradesReturnType = await upgrades(client);
    expectTypeOf(result).toEqualTypeOf<UpgradesReturnType>();
    expect(result.apricotPhase1Time).toBe("2024-01-01T00:00:00Z");
    expect(result.apricotPhase4MinPChainHeight).toBe(0);
  });
});
