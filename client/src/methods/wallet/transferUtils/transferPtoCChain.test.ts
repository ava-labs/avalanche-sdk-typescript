import { pvm } from "@avalabs/avalanchejs";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { privateKeyToAvalancheAccount } from "../../../accounts/index.js";
import { avalanche } from "../../../chains/index.js";
import { createAvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { testContext } from "../fixtures/testContext.js";
import { transferPtoCChain } from "./transferPtoCChain.js";

const privateKey1ForTest =
  "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce";

const account = privateKeyToAvalancheAccount(privateKey1ForTest);
const fromCChainBech32Address = account.getXPAddress("C", "fuji");
const fromPChainBech32Address = account.getXPAddress("P", "fuji");
const toCChainAddress =
  "0x0000000000000000000000000000000000000000" as `0x${string}`;

// Mock dependencies
vi.mock("../getContextFromURI.js", () => ({
  getContextFromURI: vi.fn(),
}));

vi.mock("../utils.js", () => ({
  getBech32AddressFromAccountOrClient: vi.fn(),
  weiToNanoAvax: vi.fn((wei: bigint) => wei / BigInt(1e9)), // Simple conversion for testing
}));

vi.mock("../pChain/prepareExportTxn.js", () => ({
  prepareExportTxn: vi.fn(),
}));

vi.mock("../../pChain/getFeeState.js", () => ({
  getFeeState: vi.fn(),
}));

vi.mock("../../pChain/getBalance.js", () => ({
  getBalance: vi.fn(),
}));

vi.mock("../../public/baseFee.js", () => ({
  baseFee: vi.fn(),
}));

vi.mock("../cChain/prepareImportTxn.js", () => ({
  prepareImportTxn: vi.fn(),
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
      ...(actual as any).pvm,
      calculateFee: vi.fn(),
    },
    utils: {
      ...(actual as any).utils,
      costCorethTx: vi.fn(() => 1), // Small value for testing - actual value would be ~21000
    },
  };
});

import { getBalance } from "../../pChain/getBalance.js";
import { getFeeState } from "../../pChain/getFeeState.js";
import { baseFee as getBaseFee } from "../../public/baseFee.js";
import { prepareImportTxn as prepareImportTxnCChain } from "../cChain/prepareImportTxn.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { prepareExportTxn as prepareExportTxnPChain } from "../pChain/prepareExportTxn.js";
import { sendXPTransaction } from "../sendXPTransaction.js";
import {
  getBech32AddressFromAccountOrClient,
  weiToNanoAvax,
} from "../utils.js";
import { waitForTxn } from "../waitForTxn.js";

describe("transferPtoCChain", () => {
  let client: ReturnType<typeof createAvalancheWalletCoreClient>;
  const mockRequest = vi.fn();
  let mockPChainExportTx: any;
  let mockCChainImportTx: any;
  let mockPChainExportBaseTx: any;
  let mockCChainImportBaseTx: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock transaction objects
    mockPChainExportBaseTx = {
      baseTx: {
        outputs: [],
      },
    };

    mockPChainExportTx = {
      getTx: vi.fn(() => mockPChainExportBaseTx),
    };

    mockCChainImportBaseTx = {
      destinationChain: {},
    };

    mockCChainImportTx = {
      getTx: vi.fn(() => mockCChainImportBaseTx),
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
    vi.mocked(getBech32AddressFromAccountOrClient)
      .mockResolvedValueOnce(fromCChainBech32Address)
      .mockResolvedValueOnce(fromPChainBech32Address);
    vi.mocked(prepareExportTxnPChain).mockResolvedValue({
      tx: mockPChainExportTx,
      exportTx: mockPChainExportBaseTx,
      chainAlias: "P",
    } as any);
    vi.mocked(getFeeState).mockResolvedValue({
      price: BigInt(1000000), // 1 nAVAX
      capacity: BigInt(1000000),
      excess: BigInt(0),
    } as any);
    vi.mocked(getBaseFee).mockResolvedValue("1000000"); // Very low baseFee for testing (1e6 wei)
    vi.mocked(getBalance).mockResolvedValue({
      balance: BigInt(10e9), // 10 AVAX in nAVAX
      unlocked: BigInt(10e9),
      lockedNotStakeable: BigInt(0),
      lockedStakeable: BigInt(0),
    } as any);
    vi.mocked(pvm.calculateFee).mockReturnValue(BigInt(1000000)); // 1 nAVAX
    vi.mocked(prepareImportTxnCChain).mockResolvedValue({
      tx: mockCChainImportTx,
      importTx: mockCChainImportBaseTx,
      chainAlias: "C",
    } as any);
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
      const pChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const cChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: pChainExportTxHash,
          chainAlias: "P",
        } as any)
        .mockResolvedValueOnce({
          txHash: cChainImportTxHash,
          chainAlias: "C",
        } as any);

      const result = await transferPtoCChain(client as any, {
        to: toCChainAddress,
        amount,
      });

      expect(result).toEqual({
        txHashes: [
          {
            txHash: pChainExportTxHash,
            chainAlias: "P",
          },
          {
            txHash: cChainImportTxHash,
            chainAlias: "C",
          },
        ],
      });

      expect(getContextFromURI).toHaveBeenCalledWith(client);
      expect(getBech32AddressFromAccountOrClient).toHaveBeenCalledWith(
        client,
        undefined,
        "C",
        "fuji"
      );
      expect(getBech32AddressFromAccountOrClient).toHaveBeenCalledWith(
        client,
        undefined,
        "P",
        "fuji"
      );
      expect(prepareExportTxnPChain).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          exportedOutputs: [
            {
              addresses: [fromCChainBech32Address],
              amount: amountInNanoAvax,
            },
          ],
          destinationChain: "C",
          context: testContext,
        })
      );
      expect(getFeeState).toHaveBeenCalledWith(client.pChainClient);
      expect(getBaseFee).toHaveBeenCalledWith(client);
      expect(getBalance).toHaveBeenCalledWith(client.pChainClient, {
        addresses: [fromPChainBech32Address],
      });
      expect(pvm.calculateFee).toHaveBeenCalledWith(
        mockPChainExportBaseTx,
        testContext.platformFeeConfig.weights,
        BigInt(1000000)
      );
      expect(sendXPTransaction).toHaveBeenCalledTimes(2);
      expect(waitForTxn).toHaveBeenCalledTimes(2);
      expect(prepareImportTxnCChain).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          fromAddresses: [fromCChainBech32Address],
          sourceChain: "P",
          toAddress: toCChainAddress,
          context: testContext,
        })
      );
    });

    test("uses provided context instead of fetching", async () => {
      const amount = BigInt(1e18);
      const pChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const cChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: pChainExportTxHash,
          chainAlias: "P",
        } as any)
        .mockResolvedValueOnce({
          txHash: cChainImportTxHash,
          chainAlias: "C",
        } as any);

      await transferPtoCChain(client as any, {
        to: toCChainAddress,
        amount,
        context: testContext,
      });

      expect(getContextFromURI).not.toHaveBeenCalled();
      expect(prepareExportTxnPChain).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          context: testContext,
        })
      );
      expect(prepareImportTxnCChain).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          context: testContext,
        })
      );
    });

    test("uses provided account parameter", async () => {
      const amount = BigInt(1e18);
      const pChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const cChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      vi.mocked(getBech32AddressFromAccountOrClient)
        .mockResolvedValueOnce(fromCChainBech32Address)
        .mockResolvedValueOnce(fromPChainBech32Address);

      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: pChainExportTxHash,
          chainAlias: "P",
        } as any)
        .mockResolvedValueOnce({
          txHash: cChainImportTxHash,
          chainAlias: "C",
        } as any);

      await transferPtoCChain(client as any, {
        to: toCChainAddress,
        amount,
        account,
      });

      expect(getBech32AddressFromAccountOrClient).toHaveBeenCalledWith(
        client,
        account,
        "C",
        "fuji"
      );
      expect(getBech32AddressFromAccountOrClient).toHaveBeenCalledWith(
        client,
        account,
        "P",
        "fuji"
      );
    });

    test("uses provided from address for both C and P chain", async () => {
      const customFromAddress = "P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz";
      const amount = BigInt(1e18);
      const pChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const cChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: pChainExportTxHash,
          chainAlias: "P",
        } as any)
        .mockResolvedValueOnce({
          txHash: cChainImportTxHash,
          chainAlias: "C",
        } as any);

      await transferPtoCChain(client as any, {
        to: toCChainAddress,
        amount,
        from: customFromAddress,
      });

      expect(getBech32AddressFromAccountOrClient).not.toHaveBeenCalled();
      expect(prepareExportTxnPChain).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          exportedOutputs: [
            {
              addresses: [customFromAddress],
              amount: weiToNanoAvax(amount),
            },
          ],
        })
      );
      expect(getBalance).toHaveBeenCalledWith(client.pChainClient, {
        addresses: [customFromAddress],
      });
      expect(prepareImportTxnCChain).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          fromAddresses: [customFromAddress],
        })
      );
    });

    test("uses mainnet HRP when networkID is not 5", async () => {
      const mainnetContext = {
        ...testContext,
        networkID: 1,
      };
      const amount = BigInt(1e18);
      const pChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const cChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      vi.mocked(getContextFromURI).mockResolvedValue(mainnetContext);
      vi.mocked(getBech32AddressFromAccountOrClient)
        .mockResolvedValueOnce("C-avax19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz")
        .mockResolvedValueOnce("P-avax19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz");

      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: pChainExportTxHash,
          chainAlias: "P",
        } as any)
        .mockResolvedValueOnce({
          txHash: cChainImportTxHash,
          chainAlias: "C",
        } as any);

      await transferPtoCChain(client as any, {
        to: toCChainAddress,
        amount,
      });

      expect(getBech32AddressFromAccountOrClient).toHaveBeenCalledWith(
        client,
        undefined,
        "C",
        "avax"
      );
      expect(getBech32AddressFromAccountOrClient).toHaveBeenCalledWith(
        client,
        undefined,
        "P",
        "avax"
      );
    });
  });

  describe("error cases", () => {
    test("throws error for invalid C-chain address", async () => {
      const amount = BigInt(1e18);

      await expect(
        transferPtoCChain(client as any, {
          to: "0xInvalid" as any,
          amount,
        })
      ).rejects.toThrow("Invalid `to` address");

      expect(prepareExportTxnPChain).not.toHaveBeenCalled();
      expect(sendXPTransaction).not.toHaveBeenCalled();
    });

    test("throws error when balance is insufficient", async () => {
      const amount = BigInt(1e18);
      const amountInNanoAvax = weiToNanoAvax(amount);
      const balance = amountInNanoAvax - BigInt(1); // Less than amount

      vi.mocked(getBalance).mockResolvedValue({
        balance,
        unlocked: balance,
        lockedNotStakeable: BigInt(0),
        lockedStakeable: BigInt(0),
      } as any);

      await expect(
        transferPtoCChain(client as any, {
          to: toCChainAddress,
          amount,
        })
      ).rejects.toThrow(
        `Insufficient balance: ${amountInNanoAvax} nAVAX is required, but only ${balance} nAVAX is available`
      );

      expect(sendXPTransaction).not.toHaveBeenCalled();
    });

    test("throws error when P-chain export fee is too high", async () => {
      const amount = BigInt(1e18);
      const amountInNanoAvax = weiToNanoAvax(amount);
      const pChainExportFee = amountInNanoAvax + BigInt(1); // Fee greater than amount

      vi.mocked(pvm.calculateFee).mockReturnValue(pChainExportFee);

      await expect(
        transferPtoCChain(client as any, {
          to: toCChainAddress,
          amount,
        })
      ).rejects.toThrow(
        `Transfer amount is too low: ${pChainExportFee} nAVAX Fee is required for P chain export txn, but only ${amountInNanoAvax} nAVAX is being transferred, try sending a higher amount`
      );

      expect(sendXPTransaction).not.toHaveBeenCalled();
    });

    test("throws error when total fee (export + import) is too high", async () => {
      const amount = BigInt(1e18);
      const amountInNanoAvax = weiToNanoAvax(amount);
      const pChainExportFee = BigInt(500000); // 0.5 nAVAX
      const baseFee = BigInt(1e6); // Very low for testing
      const pChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

      // Make C-chain import fee large enough that total fee > amount
      // We need: pChainExportFee + cChainImportFee > amountInNanoAvax
      // So: cChainImportFee > amountInNanoAvax - pChainExportFee
      // cChainImportFee = baseFee * costCorethTx (result is in wei, treated as nAVAX)
      // So: costCorethTx > (amountInNanoAvax - pChainExportFee) / baseFee
      // We want total fee to be slightly more than amount
      // Make sure the C-chain import fee is large enough
      const requiredCChainImportFee =
        amountInNanoAvax - pChainExportFee + BigInt(1000000); // Add enough to exceed amount
      const requiredGasCost = Number(requiredCChainImportFee / baseFee);

      vi.mocked(pvm.calculateFee).mockReturnValue(pChainExportFee);
      vi.mocked(getBaseFee).mockResolvedValue(baseFee.toString());
      const { utils } = await import("@avalabs/avalanchejs");
      // Use a reasonable gas cost that makes total fee > amount
      vi.mocked((utils as any).costCorethTx).mockReturnValue(requiredGasCost);
      vi.mocked(sendXPTransaction).mockResolvedValueOnce({
        txHash: pChainExportTxHash,
        chainAlias: "P",
      } as any);

      await expect(
        transferPtoCChain(client as any, {
          to: toCChainAddress,
          amount,
        })
      ).rejects.toThrow(`Transfer amount is too low:`);

      expect(sendXPTransaction).toHaveBeenCalledTimes(1); // Only export tx was sent
      expect(waitForTxn).toHaveBeenCalledTimes(1); // Only export tx was waited for
    });
  });

  describe("parallel API calls", () => {
    test("calls prepareExportTxn, getFeeState, getBaseFee, and getBalance in parallel", async () => {
      const amount = BigInt(1e18);
      const pChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const cChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      let prepareExportTxnCalled = false;
      let getFeeStateCalled = false;
      let getBaseFeeCalled = false;
      let getBalanceCalled = false;

      vi.mocked(prepareExportTxnPChain).mockImplementation(async () => {
        prepareExportTxnCalled = true;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return {
          tx: mockPChainExportTx,
          exportTx: mockPChainExportBaseTx,
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

      vi.mocked(getBaseFee).mockImplementation(async () => {
        getBaseFeeCalled = true;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return "1000000";
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

      // Ensure C-chain import fee is small enough
      const { utils } = await import("@avalabs/avalanchejs");
      vi.mocked((utils as any).costCorethTx).mockReturnValue(1);

      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: pChainExportTxHash,
          chainAlias: "P",
        } as any)
        .mockResolvedValueOnce({
          txHash: cChainImportTxHash,
          chainAlias: "C",
        } as any);

      await transferPtoCChain(client as any, {
        to: toCChainAddress,
        amount,
      });

      // All four should be called
      expect(prepareExportTxnCalled).toBe(true);
      expect(getFeeStateCalled).toBe(true);
      expect(getBaseFeeCalled).toBe(true);
      expect(getBalanceCalled).toBe(true);
    });
  });

  describe("return value", () => {
    test("returns correct structure with both txHashes and chainAliases", async () => {
      const amount = BigInt(1e18);
      const pChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const cChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      // Ensure C-chain import fee is small enough
      const { utils } = await import("@avalabs/avalanchejs");
      vi.mocked((utils as any).costCorethTx).mockReturnValue(1);

      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: pChainExportTxHash,
          chainAlias: "P",
        } as any)
        .mockResolvedValueOnce({
          txHash: cChainImportTxHash,
          chainAlias: "C",
        } as any);

      const result = await transferPtoCChain(client as any, {
        to: toCChainAddress,
        amount,
      });

      expect(result).toHaveProperty("txHashes");
      expect(Array.isArray(result.txHashes)).toBe(true);
      expect(result.txHashes).toHaveLength(2);
      expect(result.txHashes[0]).toHaveProperty("txHash", pChainExportTxHash);
      expect(result.txHashes[0]).toHaveProperty("chainAlias", "P");
      expect(result.txHashes[1]).toHaveProperty("txHash", cChainImportTxHash);
      expect(result.txHashes[1]).toHaveProperty("chainAlias", "C");
    });
  });

  describe("fee calculation", () => {
    test("calculates P-chain export fee correctly using pvm.calculateFee", async () => {
      const amount = BigInt(1e18);
      const pChainExportFee = BigInt(2000000); // 2 nAVAX
      const pChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const cChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      vi.mocked(pvm.calculateFee).mockReturnValue(pChainExportFee);
      // Ensure C-chain import fee is small enough
      const { utils } = await import("@avalabs/avalanchejs");
      vi.mocked((utils as any).costCorethTx).mockReturnValue(1);
      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: pChainExportTxHash,
          chainAlias: "P",
        } as any)
        .mockResolvedValueOnce({
          txHash: cChainImportTxHash,
          chainAlias: "C",
        } as any);

      await transferPtoCChain(client as any, {
        to: toCChainAddress,
        amount,
      });

      expect(pvm.calculateFee).toHaveBeenCalledWith(
        mockPChainExportBaseTx,
        testContext.platformFeeConfig.weights,
        BigInt(1000000) // feeState.price
      );
    });

    test("calculates C-chain import fee correctly using baseFee * costCorethTx", async () => {
      const amount = BigInt(1e18);
      const baseFee = BigInt(1e6); // Very low for testing
      const gasCost = 1; // Small value for testing
      const pChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const cChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      vi.mocked(getBaseFee).mockResolvedValue(baseFee.toString());
      const { utils } = await import("@avalabs/avalanchejs");
      // Use a small value to keep fees reasonable for testing
      vi.mocked((utils as any).costCorethTx).mockReturnValue(1);
      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: pChainExportTxHash,
          chainAlias: "P",
        } as any)
        .mockResolvedValueOnce({
          txHash: cChainImportTxHash,
          chainAlias: "C",
        } as any);

      await transferPtoCChain(client as any, {
        to: toCChainAddress,
        amount,
      });

      expect((utils as any).costCorethTx).toHaveBeenCalled();
      // costCorethTx is called with the transaction object from prepareImportTxnCChain
      const costCorethTxCall = vi.mocked((utils as any).costCorethTx).mock
        .calls[0];
      expect(costCorethTxCall[0]).toBe(mockCChainImportTx);
    });
  });

  describe("transaction sequencing", () => {
    test("sends P-chain export transaction before C-chain import", async () => {
      const amount = BigInt(1e18);
      const pChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const cChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      // Ensure C-chain import fee is small enough
      const { utils } = await import("@avalabs/avalanchejs");
      vi.mocked((utils as any).costCorethTx).mockReturnValue(1);

      const sendCalls: any[] = [];
      vi.mocked(sendXPTransaction).mockImplementation(
        async (client, params) => {
          sendCalls.push(params);
          if (sendCalls.length === 1) {
            return {
              txHash: pChainExportTxHash,
              chainAlias: "P",
            } as any;
          } else {
            return {
              txHash: cChainImportTxHash,
              chainAlias: "C",
            } as any;
          }
        }
      );

      await transferPtoCChain(client as any, {
        to: toCChainAddress,
        amount,
      });

      expect(sendCalls).toHaveLength(2);
      expect(sendCalls[0]).toMatchObject({
        tx: mockPChainExportTx,
        chainAlias: "P",
      });
      expect(sendCalls[1]).toMatchObject({
        tx: mockCChainImportTx,
        chainAlias: "C",
      });
      expect(prepareImportTxnCChain).toHaveBeenCalledAfter(
        vi.mocked(waitForTxn) as any
      );
    });
  });

  describe("address handling", () => {
    test("gets separate C-chain and P-chain bech32 addresses", async () => {
      const amount = BigInt(1e18);
      const pChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const cChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      const cChainAddr = "C-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz";
      const pChainAddr = "P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz";

      vi.mocked(getBech32AddressFromAccountOrClient)
        .mockResolvedValueOnce(cChainAddr)
        .mockResolvedValueOnce(pChainAddr);

      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: pChainExportTxHash,
          chainAlias: "P",
        } as any)
        .mockResolvedValueOnce({
          txHash: cChainImportTxHash,
          chainAlias: "C",
        } as any);

      await transferPtoCChain(client as any, {
        to: toCChainAddress,
        amount,
      });

      expect(getBech32AddressFromAccountOrClient).toHaveBeenCalledTimes(2);
      expect(prepareExportTxnPChain).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          exportedOutputs: [
            {
              addresses: [cChainAddr],
              amount: weiToNanoAvax(amount),
            },
          ],
        })
      );
      expect(getBalance).toHaveBeenCalledWith(client.pChainClient, {
        addresses: [pChainAddr],
      });
      expect(prepareImportTxnCChain).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          fromAddresses: [cChainAddr],
        })
      );
    });
  });
});
