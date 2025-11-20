import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { privateKeyToAvalancheAccount } from "../../accounts/index.js";
import { avalanche } from "../../chains/index.js";
import { createAvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { waitForTxn } from "./waitForTxn.js";

const privateKey1ForTest =
  "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce";

const account = privateKeyToAvalancheAccount(privateKey1ForTest);

// Mock the transaction status methods
vi.mock("../cChain/getAtomicTxStatus.js", () => ({
  getAtomicTxStatus: vi.fn(),
}));

vi.mock("../pChain/getTxStatus.js", () => ({
  getTxStatus: vi.fn(),
}));

vi.mock("../xChain/getTxStatus.js", () => ({
  getTxStatus: vi.fn(),
}));

import { getAtomicTxStatus as getCChainTxStatus } from "../cChain/getAtomicTxStatus.js";
import { getTxStatus as getPChainTxStatus } from "../pChain/getTxStatus.js";
import { getTxStatus as getXChainTxStatus } from "../xChain/getTxStatus.js";

describe("waitForTxn", () => {
  let client: ReturnType<typeof createAvalancheWalletCoreClient>;
  const mockRequest = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    client = createAvalancheWalletCoreClient({
      chain: avalanche,
      transport: {
        type: "custom",
        provider: {
          request: mockRequest,
        },
      },
      account,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("resolves when P-Chain transaction is Accepted", async () => {
    const txHash = "0x1234567890abcdef";
    vi.mocked(getPChainTxStatus).mockResolvedValue({
      status: "Accepted",
    } as any);

    const promise = waitForTxn(client as any, {
      txHash,
      chainAlias: "P",
    });

    await expect(promise).resolves.toBeUndefined();
    expect(getPChainTxStatus).toHaveBeenCalledWith(client.pChainClient, {
      txID: txHash,
    });
    expect(getPChainTxStatus).toHaveBeenCalledTimes(1);
  });

  test("resolves when X-Chain transaction is Committed", async () => {
    const txHash = "0x1234567890abcdef";
    vi.mocked(getXChainTxStatus).mockResolvedValue({
      status: "Committed",
    } as any);

    const promise = waitForTxn(client as any, {
      txHash,
      chainAlias: "X",
    });

    await expect(promise).resolves.toBeUndefined();
    expect(getXChainTxStatus).toHaveBeenCalledWith(client.xChainClient, {
      txID: txHash,
    });
  });

  test("resolves when C-Chain transaction is Accepted", async () => {
    const txHash = "0x1234567890abcdef";
    vi.mocked(getCChainTxStatus).mockResolvedValue({
      status: "Accepted",
    } as any);

    const promise = waitForTxn(client as any, {
      txHash,
      chainAlias: "C",
    });

    await expect(promise).resolves.toBeUndefined();
    expect(getCChainTxStatus).toHaveBeenCalledWith(client.cChainClient, {
      txID: txHash,
    });
  });

  test("throws error when transaction is Rejected", async () => {
    const txHash = "0x1234567890abcdef";
    vi.mocked(getPChainTxStatus).mockResolvedValue({
      status: "Rejected",
    } as any);

    const promise = waitForTxn(client as any, {
      txHash,
      chainAlias: "P",
    });

    await expect(promise).rejects.toThrow(
      `Transaction ${txHash} rejected with status Rejected`
    );
  });

  test("throws error when transaction is Dropped", async () => {
    const txHash = "0x1234567890abcdef";
    vi.mocked(getXChainTxStatus).mockResolvedValue({
      status: "Dropped",
    } as any);

    const promise = waitForTxn(client as any, {
      txHash,
      chainAlias: "X",
    });

    await expect(promise).rejects.toThrow(
      `Transaction ${txHash} rejected with status Dropped`
    );
  });

  test("retries when transaction status is Processing", async () => {
    const txHash = "0x1234567890abcdef";
    vi.mocked(getPChainTxStatus)
      .mockResolvedValueOnce({
        status: "Processing",
      } as any)
      .mockResolvedValueOnce({
        status: "Accepted",
      } as any);

    const promise = waitForTxn(client as any, {
      txHash,
      chainAlias: "P",
      sleepTime: 100,
    });

    // Fast-forward time to trigger the retry
    await vi.advanceTimersByTimeAsync(100);

    await expect(promise).resolves.toBeUndefined();
    expect(getPChainTxStatus).toHaveBeenCalledTimes(2);
  });

  test("uses custom sleepTime", async () => {
    const txHash = "0x1234567890abcdef";
    vi.mocked(getPChainTxStatus)
      .mockResolvedValueOnce({
        status: "Processing",
      } as any)
      .mockResolvedValueOnce({
        status: "Accepted",
      } as any);

    const promise = waitForTxn(client as any, {
      txHash,
      chainAlias: "P",
      sleepTime: 500,
    });

    // Fast-forward time with custom sleep time
    await vi.advanceTimersByTimeAsync(500);

    await expect(promise).resolves.toBeUndefined();
    expect(getPChainTxStatus).toHaveBeenCalledTimes(2);
  });

  test("uses default sleepTime and maxRetries when not provided", async () => {
    const txHash = "0x1234567890abcdef";
    vi.mocked(getPChainTxStatus).mockResolvedValue({
      status: "Accepted",
    } as any);

    const promise = waitForTxn(client as any, {
      txHash,
      chainAlias: "P",
    });

    await expect(promise).resolves.toBeUndefined();
    expect(getPChainTxStatus).toHaveBeenCalledTimes(1);
  });
});
