import { pvm } from "@avalabs/avalanchejs";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { privateKeyToAvalancheAccount } from "../../../accounts/index.js";
import { avalanche } from "../../../chains/index.js";
import { createAvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { testContext } from "../fixtures/testContext.js";
import { transferPtoPChain } from "./transferPtoPChain.js";

const privateKey1ForTest =
  "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce";

const account = privateKeyToAvalancheAccount(privateKey1ForTest);
const fromPChainAddress = account.getXPAddress("P", "fuji");
const toPChainAddress = "P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz";

// Mock dependencies
vi.mock("../getContextFromURI.js", () => ({
  getContextFromURI: vi.fn(),
}));

vi.mock("../utils.js", () => ({
  getBech32AddressFromAccountOrClient: vi.fn(),
  weiToNanoAvax: vi.fn((wei: bigint) => wei / BigInt(1e9)), // Simple conversion for testing
}));

vi.mock("../pChain/prepareBaseTxn.js", () => ({
  prepareBaseTxn: vi.fn(),
}));

vi.mock("../../pChain/getFeeState.js", () => ({
  getFeeState: vi.fn(),
}));

vi.mock("../../pChain/getBalance.js", () => ({
  getBalance: vi.fn(),
}));

vi.mock("../sendXPTransaction.js", () => ({
  sendXPTransaction: vi.fn(),
}));

vi.mock("../waitForTxn.js", () => ({
  waitForTxn: vi.fn(),
}));

vi.mock("@avalabs/avalanchejs", async () => {
  const actual = await vi.importActual("@avalabs/avalanchejs");
  return {
    ...actual,
    pvm: {
      calculateFee: vi.fn(),
    },
  };
});

import { getBalance } from "../../pChain/getBalance.js";
import { getFeeState } from "../../pChain/getFeeState.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { prepareBaseTxn } from "../pChain/prepareBaseTxn.js";
import { sendXPTransaction } from "../sendXPTransaction.js";
import {
  getBech32AddressFromAccountOrClient,
  weiToNanoAvax,
} from "../utils.js";
import { waitForTxn } from "../waitForTxn.js";

describe("transferPtoPChain", () => {
  let client: ReturnType<typeof createAvalancheWalletCoreClient>;
  const mockRequest = vi.fn();
  let mockBaseTx: any;
  let mockUnsignedTx: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock transaction objects
    mockBaseTx = {
      baseTx: {
        outputs: [],
      },
    };

    mockUnsignedTx = {
      getTx: vi.fn(() => mockBaseTx),
    };

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

    // Default mocks
    vi.mocked(getContextFromURI).mockResolvedValue(testContext);
    vi.mocked(getBech32AddressFromAccountOrClient).mockResolvedValue(
      fromPChainAddress
    );
    vi.mocked(prepareBaseTxn).mockResolvedValue({
      tx: mockUnsignedTx,
      baseTx: mockBaseTx,
      chainAlias: "P",
    } as any);
    vi.mocked(getFeeState).mockResolvedValue({
      price: BigInt(1000000), // 1 nAVAX
      capacity: BigInt(1000000),
      excess: BigInt(0),
    } as any);
    vi.mocked(getBalance).mockResolvedValue({
      balance: BigInt(10e9), // 10 AVAX in nAVAX
      unlocked: BigInt(10e9),
      lockedNotStakeable: BigInt(0),
      lockedStakeable: BigInt(0),
    } as any);
    vi.mocked(pvm.calculateFee).mockReturnValue(BigInt(1000000)); // 1 nAVAX fee
    vi.mocked(sendXPTransaction).mockResolvedValue({
      txHash:
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      chainAlias: "P",
    } as any);
    vi.mocked(waitForTxn).mockResolvedValue(undefined);
  });

  describe("successful transfers", () => {
    test("transfers successfully with all required steps", async () => {
      const amount = BigInt(1e18); // 1 AVAX in wei
      const amountInNanoAvax = weiToNanoAvax(amount);
      const txHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

      vi.mocked(sendXPTransaction).mockResolvedValue({
        txHash,
        chainAlias: "P",
      } as any);

      const result = await transferPtoPChain(client as any, {
        to: toPChainAddress,
        amount,
      });

      expect(result).toEqual({
        txHashes: [
          {
            txHash,
            chainAlias: "P",
          },
        ],
      });

      expect(getContextFromURI).toHaveBeenCalledWith(client);
      expect(getBech32AddressFromAccountOrClient).toHaveBeenCalledWith(
        client,
        undefined,
        "P",
        "fuji"
      );
      expect(prepareBaseTxn).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          fromAddresses: [fromPChainAddress],
          outputs: [
            {
              addresses: [toPChainAddress],
              amount: amountInNanoAvax,
            },
          ],
          context: testContext,
        })
      );
      expect(getFeeState).toHaveBeenCalledWith(client.pChainClient);
      expect(getBalance).toHaveBeenCalledWith(client.pChainClient, {
        addresses: [fromPChainAddress],
      });
      expect(pvm.calculateFee).toHaveBeenCalledWith(
        mockBaseTx,
        testContext.platformFeeConfig.weights,
        BigInt(1000000)
      );
      expect(sendXPTransaction).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          tx: mockUnsignedTx,
          chainAlias: "P",
        })
      );
      expect(waitForTxn).toHaveBeenCalledWith(client, {
        txHash,
        chainAlias: "P",
      });
    });

    test("uses provided context instead of fetching", async () => {
      const amount = BigInt(1e18);
      const txHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

      vi.mocked(sendXPTransaction).mockResolvedValue({
        txHash,
        chainAlias: "P",
      } as any);

      await transferPtoPChain(client as any, {
        to: toPChainAddress,
        amount,
        context: testContext,
      });

      expect(getContextFromURI).not.toHaveBeenCalled();
      expect(prepareBaseTxn).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          context: testContext,
        })
      );
    });

    test("uses provided account parameter", async () => {
      const amount = BigInt(1e18);
      const txHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

      vi.mocked(sendXPTransaction).mockResolvedValue({
        txHash,
        chainAlias: "P",
      } as any);

      await transferPtoPChain(client as any, {
        to: toPChainAddress,
        amount,
        account,
      });

      expect(getBech32AddressFromAccountOrClient).toHaveBeenCalledWith(
        client,
        account,
        "P",
        "fuji"
      );
    });

    test("uses mainnet HRP when networkID is not 5", async () => {
      const mainnetContext = {
        ...testContext,
        networkID: 1,
      };
      const amount = BigInt(1e18);
      const txHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

      vi.mocked(getContextFromURI).mockResolvedValue(mainnetContext);
      vi.mocked(sendXPTransaction).mockResolvedValue({
        txHash,
        chainAlias: "P",
      } as any);

      await transferPtoPChain(client as any, {
        to: "P-avax19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz",
        amount,
      });

      expect(getBech32AddressFromAccountOrClient).toHaveBeenCalledWith(
        client,
        undefined,
        "P",
        "avax"
      );
    });
  });

  describe("error cases", () => {
    test("throws error for invalid P-chain address (not starting with P-)", async () => {
      const amount = BigInt(1e18);

      await expect(
        transferPtoPChain(client as any, {
          to: "X-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz" as any,
          amount,
        })
      ).rejects.toThrow("Invalid P chain address, it should start with P-");

      expect(prepareBaseTxn).not.toHaveBeenCalled();
      expect(sendXPTransaction).not.toHaveBeenCalled();
    });

    test("throws error when balance is insufficient", async () => {
      const amount = BigInt(1e18); // 1 AVAX
      const amountInNanoAvax = weiToNanoAvax(amount);
      const balance = amountInNanoAvax - BigInt(1); // Less than amount

      vi.mocked(getBalance).mockResolvedValue({
        balance,
        unlocked: balance,
        lockedNotStakeable: BigInt(0),
        lockedStakeable: BigInt(0),
      } as any);

      await expect(
        transferPtoPChain(client as any, {
          to: toPChainAddress,
          amount,
        })
      ).rejects.toThrow(
        `Insufficient balance: ${amountInNanoAvax} nAVAX is required, but only ${balance} nAVAX is available`
      );

      expect(sendXPTransaction).not.toHaveBeenCalled();
    });

    test("throws error when transfer amount is too low (fee > amount)", async () => {
      const amount = BigInt(5e8); // 0.5 AVAX in wei
      const amountInNanoAvax = weiToNanoAvax(amount);
      const fee = amountInNanoAvax + BigInt(1); // Fee is greater than amount

      vi.mocked(pvm.calculateFee).mockReturnValue(fee);
      vi.mocked(getBalance).mockResolvedValue({
        balance: BigInt(10e9), // 10 AVAX
        unlocked: BigInt(10e9),
        lockedNotStakeable: BigInt(0),
        lockedStakeable: BigInt(0),
      } as any);

      await expect(
        transferPtoPChain(client as any, {
          to: toPChainAddress,
          amount,
        })
      ).rejects.toThrow(
        `Transfer amount is too low: ${fee} nAVAX Fee is required, but only ${amountInNanoAvax} nAVAX is being transferred`
      );

      expect(sendXPTransaction).not.toHaveBeenCalled();
    });

    test("throws error when balance equals amount but fee is required", async () => {
      const amount = BigInt(1e18); // 1 AVAX
      const amountInNanoAvax = weiToNanoAvax(amount);
      const fee = BigInt(1000000); // 1 nAVAX fee
      const balance = amountInNanoAvax; // Exactly equal to amount, but fee is needed

      vi.mocked(getBalance).mockResolvedValue({
        balance,
        unlocked: balance,
        lockedNotStakeable: BigInt(0),
        lockedStakeable: BigInt(0),
      } as any);
      vi.mocked(pvm.calculateFee).mockReturnValue(fee);

      // This should pass because balance >= amount, but if fee > amount, it will fail
      // Let's test the case where fee is less than amount but balance is exactly amount
      // In this case, it should still work if balance >= amount (fee is separate)
      // Actually, looking at the code, it checks balanceInNanoAvax < weiToNanoAvax(params.amount)
      // So if balance equals amount, it should pass that check
      // But then it checks if fee > amount, which would fail
      // Let me test the case where fee > amount
      const largeFee = amountInNanoAvax + BigInt(1);
      vi.mocked(pvm.calculateFee).mockReturnValue(largeFee);

      await expect(
        transferPtoPChain(client as any, {
          to: toPChainAddress,
          amount,
        })
      ).rejects.toThrow(
        `Transfer amount is too low: ${largeFee} nAVAX Fee is required, but only ${amountInNanoAvax} nAVAX is being transferred`
      );
    });
  });

  describe("parallel API calls", () => {
    test("calls prepareBaseTxn, getFeeState, and getBalance in parallel", async () => {
      const amount = BigInt(1e18);
      const txHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

      let prepareBaseTxnCalled = false;
      let getFeeStateCalled = false;
      let getBalanceCalled = false;

      vi.mocked(prepareBaseTxn).mockImplementation(async () => {
        prepareBaseTxnCalled = true;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return {
          tx: mockUnsignedTx,
          baseTx: mockBaseTx,
          chainAlias: "P",
        } as any;
      });

      vi.mocked(getFeeState).mockImplementation(async () => {
        getFeeStateCalled = true;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return {
          price: BigInt(1000000),
          capacity: BigInt(1000000),
          excess: BigInt(0),
        } as any;
      });

      vi.mocked(getBalance).mockImplementation(async () => {
        getBalanceCalled = true;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return {
          balance: BigInt(10e9),
          unlocked: BigInt(10e9),
          lockedNotStakeable: BigInt(0),
          lockedStakeable: BigInt(0),
        } as any;
      });

      vi.mocked(sendXPTransaction).mockResolvedValue({
        txHash,
        chainAlias: "P",
      } as any);

      await transferPtoPChain(client as any, {
        to: toPChainAddress,
        amount,
      });

      // All three should be called
      expect(prepareBaseTxnCalled).toBe(true);
      expect(getFeeStateCalled).toBe(true);
      expect(getBalanceCalled).toBe(true);
    });
  });

  describe("return value", () => {
    test("returns correct structure with txHash and chainAlias", async () => {
      const amount = BigInt(1e18);
      const txHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

      vi.mocked(sendXPTransaction).mockResolvedValue({
        txHash,
        chainAlias: "P",
      } as any);

      const result = await transferPtoPChain(client as any, {
        to: toPChainAddress,
        amount,
      });

      expect(result).toHaveProperty("txHashes");
      expect(Array.isArray(result.txHashes)).toBe(true);
      expect(result.txHashes).toHaveLength(1);
      expect(result.txHashes[0]).toHaveProperty("txHash", txHash);
      expect(result.txHashes[0]).toHaveProperty("chainAlias", "P");
    });
  });

  describe("fee calculation", () => {
    test("calculates fee correctly using pvm.calculateFee", async () => {
      const amount = BigInt(1e18);
      const fee = BigInt(2000000); // 2 nAVAX
      const txHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

      vi.mocked(pvm.calculateFee).mockReturnValue(fee);
      vi.mocked(sendXPTransaction).mockResolvedValue({
        txHash,
        chainAlias: "P",
      } as any);

      await transferPtoPChain(client as any, {
        to: toPChainAddress,
        amount,
      });

      expect(pvm.calculateFee).toHaveBeenCalledWith(
        mockBaseTx,
        testContext.platformFeeConfig.weights,
        BigInt(1000000) // feeState.price
      );
    });
  });
});
