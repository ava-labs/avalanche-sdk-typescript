import { beforeEach, describe, expect, test, vi } from "vitest";
import { privateKeyToAvalancheAccount } from "../../accounts/index.js";
import { avalanche } from "../../chains/index.js";
import { createAvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { send } from "./send.js";

const privateKey1ForTest =
  "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce";

const account = privateKeyToAvalancheAccount(privateKey1ForTest);
const toCChainAddress =
  "0x0000000000000000000000000000000000000000" as `0x${string}`;
const toPChainAddress = "P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz";

// Mock all transfer functions
vi.mock("./transferUtils/transferCtoCChain.js", () => ({
  transferCtoCChain: vi.fn(),
}));

vi.mock("./transferUtils/transferCtoPChain.js", () => ({
  transferCtoPChain: vi.fn(),
}));

vi.mock("./transferUtils/transferPtoCChain.js", () => ({
  transferPtoCChain: vi.fn(),
}));

vi.mock("./transferUtils/transferPtoPChain.js", () => ({
  transferPtoPChain: vi.fn(),
}));

import { transferCtoCChain } from "./transferUtils/transferCtoCChain.js";
import { transferCtoPChain } from "./transferUtils/transferCtoPChain.js";
import { transferPtoCChain } from "./transferUtils/transferPtoCChain.js";
import { transferPtoPChain } from "./transferUtils/transferPtoPChain.js";

describe("send", () => {
  let client: ReturnType<typeof createAvalancheWalletCoreClient>;
  const mockRequest = vi.fn();
  const mockReturnValue = {
    txHashes: [
      {
        txHash:
          "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        chainAlias: "C" as const,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

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

    // Default mock return values
    vi.mocked(transferCtoCChain).mockResolvedValue(mockReturnValue);
    vi.mocked(transferCtoPChain).mockResolvedValue(mockReturnValue);
    vi.mocked(transferPtoCChain).mockResolvedValue(mockReturnValue);
    vi.mocked(transferPtoPChain).mockResolvedValue(mockReturnValue);
  });

  describe("default values", () => {
    test("uses default sourceChain='C' and destinationChain='C' when not provided", async () => {
      const amount = BigInt(1e18);

      await send(client as any, {
        to: toCChainAddress,
        amount,
      });

      expect(transferCtoCChain).toHaveBeenCalledWith(client, {
        to: toCChainAddress,
        amount,
        sourceChain: undefined,
        destinationChain: undefined,
        token: undefined,
      });
      expect(transferCtoPChain).not.toHaveBeenCalled();
      expect(transferPtoCChain).not.toHaveBeenCalled();
      expect(transferPtoPChain).not.toHaveBeenCalled();
    });

    test("uses default token='AVAX' when not provided", async () => {
      const amount = BigInt(1e18);

      await send(client as any, {
        to: toCChainAddress,
        amount,
      });

      // Token is destructured with default "AVAX" in the function, so undefined is passed to transfer function
      expect(transferCtoCChain).toHaveBeenCalledWith(client, {
        to: toCChainAddress,
        amount,
        sourceChain: undefined,
        destinationChain: undefined,
        token: undefined,
      });
    });
  });

  describe("routing to transfer functions", () => {
    test("routes C -> C to transferCtoCChain", async () => {
      const amount = BigInt(1e18);

      const result = await send(client as any, {
        to: toCChainAddress,
        amount,
        sourceChain: "C",
        destinationChain: "C",
      });

      expect(transferCtoCChain).toHaveBeenCalledTimes(1);
      expect(transferCtoCChain).toHaveBeenCalledWith(client, {
        to: toCChainAddress,
        amount,
        sourceChain: "C",
        destinationChain: "C",
        token: undefined,
      });
      expect(result).toEqual(mockReturnValue);
      expect(transferCtoPChain).not.toHaveBeenCalled();
      expect(transferPtoCChain).not.toHaveBeenCalled();
      expect(transferPtoPChain).not.toHaveBeenCalled();
    });

    test("routes C -> P to transferCtoPChain", async () => {
      const amount = BigInt(1e18);

      const result = await send(client as any, {
        to: toPChainAddress,
        amount,
        sourceChain: "C",
        destinationChain: "P",
      });

      expect(transferCtoPChain).toHaveBeenCalledTimes(1);
      expect(transferCtoPChain).toHaveBeenCalledWith(client, {
        to: toPChainAddress,
        amount,
        sourceChain: "C",
        destinationChain: "P",
        token: undefined,
      });
      expect(result).toEqual(mockReturnValue);
      expect(transferCtoCChain).not.toHaveBeenCalled();
      expect(transferPtoCChain).not.toHaveBeenCalled();
      expect(transferPtoPChain).not.toHaveBeenCalled();
    });

    test("routes P -> P to transferPtoPChain", async () => {
      const amount = BigInt(1e18);

      const result = await send(client as any, {
        to: toPChainAddress,
        amount,
        sourceChain: "P",
        destinationChain: "P",
      });

      expect(transferPtoPChain).toHaveBeenCalledTimes(1);
      expect(transferPtoPChain).toHaveBeenCalledWith(client, {
        to: toPChainAddress,
        amount,
        sourceChain: "P",
        destinationChain: "P",
        token: undefined,
      });
      expect(result).toEqual(mockReturnValue);
      expect(transferCtoCChain).not.toHaveBeenCalled();
      expect(transferCtoPChain).not.toHaveBeenCalled();
      expect(transferPtoCChain).not.toHaveBeenCalled();
    });

    test("routes P -> C to transferPtoCChain", async () => {
      const amount = BigInt(1e18);

      const result = await send(client as any, {
        to: toCChainAddress,
        amount,
        sourceChain: "P",
        destinationChain: "C",
      });

      expect(transferPtoCChain).toHaveBeenCalledTimes(1);
      expect(transferPtoCChain).toHaveBeenCalledWith(client, {
        to: toCChainAddress,
        amount,
        sourceChain: "P",
        destinationChain: "C",
        token: undefined,
      });
      expect(result).toEqual(mockReturnValue);
      expect(transferCtoCChain).not.toHaveBeenCalled();
      expect(transferCtoPChain).not.toHaveBeenCalled();
      expect(transferPtoPChain).not.toHaveBeenCalled();
    });
  });

  describe("parameter passing", () => {
    test("passes all parameters to transfer function", async () => {
      const amount = BigInt(1e18);
      const customFrom =
        "0x1111111111111111111111111111111111111111" as `0x${string}`;
      const customContext = {} as any;

      await send(client as any, {
        to: toCChainAddress,
        amount,
        sourceChain: "C",
        destinationChain: "C",
        from: customFrom,
        account,
        token: "AVAX",
        context: customContext,
      });

      expect(transferCtoCChain).toHaveBeenCalledWith(client, {
        to: toCChainAddress,
        amount,
        sourceChain: "C",
        destinationChain: "C",
        from: customFrom,
        account,
        token: "AVAX",
        context: customContext,
      });
    });

    test("passes account parameter correctly", async () => {
      const amount = BigInt(1e18);

      await send(client as any, {
        to: toCChainAddress,
        amount,
        account,
      });

      expect(transferCtoCChain).toHaveBeenCalledWith(client, {
        to: toCChainAddress,
        amount,
        account,
        sourceChain: undefined,
        destinationChain: undefined,
        token: undefined,
      });
    });
  });

  describe("error cases", () => {
    test("throws error for invalid token", async () => {
      const amount = BigInt(1e18);

      await expect(
        send(client as any, {
          to: toCChainAddress,
          amount,
          token: "INVALID" as any,
        })
      ).rejects.toThrow("Invalid token: INVALID, only AVAX is supported.");

      expect(transferCtoCChain).not.toHaveBeenCalled();
      expect(transferCtoPChain).not.toHaveBeenCalled();
      expect(transferPtoCChain).not.toHaveBeenCalled();
      expect(transferPtoPChain).not.toHaveBeenCalled();
    });

    test("throws error for invalid source chain", async () => {
      const amount = BigInt(1e18);

      await expect(
        send(client as any, {
          to: toCChainAddress,
          amount,
          sourceChain: "X" as any,
        })
      ).rejects.toThrow("Invalid source chain: X");

      expect(transferCtoCChain).not.toHaveBeenCalled();
      expect(transferCtoPChain).not.toHaveBeenCalled();
      expect(transferPtoCChain).not.toHaveBeenCalled();
      expect(transferPtoPChain).not.toHaveBeenCalled();
    });

    test("throws error for invalid destination chain when source is C", async () => {
      const amount = BigInt(1e18);

      await expect(
        send(client as any, {
          to: toCChainAddress,
          amount,
          sourceChain: "C",
          destinationChain: "X" as any,
        })
      ).rejects.toThrow("Invalid destination chain: X");

      expect(transferCtoCChain).not.toHaveBeenCalled();
      expect(transferCtoPChain).not.toHaveBeenCalled();
      expect(transferPtoCChain).not.toHaveBeenCalled();
      expect(transferPtoPChain).not.toHaveBeenCalled();
    });

    test("throws error for invalid destination chain when source is P", async () => {
      const amount = BigInt(1e18);

      await expect(
        send(client as any, {
          to: toPChainAddress,
          amount,
          sourceChain: "P",
          destinationChain: "X" as any,
        })
      ).rejects.toThrow("Invalid destination chain: X");

      expect(transferCtoCChain).not.toHaveBeenCalled();
      expect(transferCtoPChain).not.toHaveBeenCalled();
      expect(transferPtoCChain).not.toHaveBeenCalled();
      expect(transferPtoPChain).not.toHaveBeenCalled();
    });
  });

  describe("return value", () => {
    test("returns the result from the transfer function", async () => {
      const amount = BigInt(1e18);
      const customReturnValue = {
        txHashes: [
          {
            txHash:
              "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
            chainAlias: "P" as const,
          },
          {
            txHash:
              "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
            chainAlias: "C" as const,
          },
        ],
      };

      vi.mocked(transferCtoPChain).mockResolvedValue(customReturnValue);

      const result = await send(client as any, {
        to: toPChainAddress,
        amount,
        sourceChain: "C",
        destinationChain: "P",
      });

      expect(result).toEqual(customReturnValue);
      expect(result.txHashes).toHaveLength(2);
      expect(result.txHashes[0].chainAlias).toBe("P");
      expect(result.txHashes[1].chainAlias).toBe("C");
    });
  });

  describe("token validation", () => {
    test("accepts AVAX token explicitly", async () => {
      const amount = BigInt(1e18);

      await send(client as any, {
        to: toCChainAddress,
        amount,
        token: "AVAX",
      });

      expect(transferCtoCChain).toHaveBeenCalled();
    });

    test("validates token before routing", async () => {
      const amount = BigInt(1e18);

      await expect(
        send(client as any, {
          to: toCChainAddress,
          amount,
          sourceChain: "C",
          destinationChain: "C",
          token: "USDC" as any,
        })
      ).rejects.toThrow("Invalid token: USDC, only AVAX is supported.");

      // Should not call any transfer function if token is invalid
      expect(transferCtoCChain).not.toHaveBeenCalled();
    });
  });

  describe("all routing combinations", () => {
    test("covers all valid routing paths", async () => {
      const amount = BigInt(1e18);

      // C -> C
      await send(client as any, {
        to: toCChainAddress,
        amount,
        sourceChain: "C",
        destinationChain: "C",
      });

      // C -> P
      await send(client as any, {
        to: toPChainAddress,
        amount,
        sourceChain: "C",
        destinationChain: "P",
      });

      // P -> P
      await send(client as any, {
        to: toPChainAddress,
        amount,
        sourceChain: "P",
        destinationChain: "P",
      });

      // P -> C
      await send(client as any, {
        to: toCChainAddress,
        amount,
        sourceChain: "P",
        destinationChain: "C",
      });

      expect(transferCtoCChain).toHaveBeenCalledTimes(1);
      expect(transferCtoPChain).toHaveBeenCalledTimes(1);
      expect(transferPtoPChain).toHaveBeenCalledTimes(1);
      expect(transferPtoCChain).toHaveBeenCalledTimes(1);
    });
  });
});
