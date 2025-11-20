import { evm, pvm } from "@avalabs/avalanchejs";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { privateKeyToAvalancheAccount } from "../../../accounts/index.js";
import { avalanche } from "../../../chains/index.js";
import { createAvalancheWalletCoreClient } from "../../../clients/createAvalancheWalletCoreClient.js";
import { testContext } from "../fixtures/testContext.js";
import { transferCtoPChain } from "./transferCtoPChain.js";

const privateKey1ForTest =
  "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce";

const account = privateKeyToAvalancheAccount(privateKey1ForTest);
const fromEVMAddress = account.getEVMAddress();
const fromPChainAddress = account.getXPAddress("P", "fuji");
const toPChainAddress = "P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz";

// Mock dependencies
vi.mock("../getContextFromURI.js", () => ({
  getContextFromURI: vi.fn(),
}));

vi.mock("../utils.js", () => ({
  getEVMAddressFromAccountOrClient: vi.fn(),
  getBech32AddressFromAccountOrClient: vi.fn(),
  weiToNanoAvax: vi.fn((wei: bigint) => wei / BigInt(1e9)), // Simple conversion for testing
  bech32AddressToBytes: vi.fn((addr: string) => new Uint8Array(20)),
  getChainIdFromAlias: vi.fn((alias: string, networkID: number) => {
    if (alias === "P" && networkID === 5)
      return "11111111111111111111111111111111LpoYY";
    return "11111111111111111111111111111111LpoYY";
  }),
}));

vi.mock("../cChain/prepareExportTxn.js", () => ({
  prepareExportTxn: vi.fn(),
}));

vi.mock("../../pChain/getFeeState.js", () => ({
  getFeeState: vi.fn(),
}));

vi.mock("../../public/baseFee.js", () => ({
  baseFee: vi.fn(),
}));

vi.mock("viem/actions", () => ({
  getBalance: vi.fn(),
  getTransactionCount: vi.fn(),
}));

vi.mock("../pChain/prepareImportTxn.js", () => ({
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
    evm: {
      ...(actual as any).evm,
      estimateExportCost: vi.fn(),
    },
    pvm: {
      ...(actual as any).pvm,
      calculateFee: vi.fn(),
    },
  };
});

import { getBalance, getTransactionCount } from "viem/actions";
import { getFeeState } from "../../pChain/getFeeState.js";
import { baseFee as getBaseFee } from "../../public/baseFee.js";
import { prepareExportTxn as prepareExportTxnCChain } from "../cChain/prepareExportTxn.js";
import { getContextFromURI } from "../getContextFromURI.js";
import { prepareImportTxn as prepareImportTxnPChain } from "../pChain/prepareImportTxn.js";
import { sendXPTransaction } from "../sendXPTransaction.js";
import {
  getBech32AddressFromAccountOrClient,
  getEVMAddressFromAccountOrClient,
  weiToNanoAvax,
} from "../utils.js";
import { waitForTxn } from "../waitForTxn.js";

describe("transferCtoPChain", () => {
  let client: ReturnType<typeof createAvalancheWalletCoreClient>;
  const mockRequest = vi.fn();
  let mockCChainExportTx: any;
  let mockPChainImportTx: any;
  let mockCChainExportBaseTx: any;
  let mockPChainImportBaseTx: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock transaction objects
    mockCChainExportBaseTx = {
      destinationChain: {},
    };

    mockCChainExportTx = {
      getTx: vi.fn(() => mockCChainExportBaseTx),
    };

    mockPChainImportBaseTx = {
      baseTx: {
        outputs: [],
      },
    };

    mockPChainImportTx = {
      getTx: vi.fn(() => mockPChainImportBaseTx),
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
    vi.mocked(getEVMAddressFromAccountOrClient).mockResolvedValue(
      fromEVMAddress
    );
    vi.mocked(getBech32AddressFromAccountOrClient).mockResolvedValue(
      fromPChainAddress
    );
    vi.mocked(prepareExportTxnCChain).mockResolvedValue({
      tx: mockCChainExportTx,
      exportTx: mockCChainExportBaseTx,
      chainAlias: "C",
    } as any);
    vi.mocked(getFeeState).mockResolvedValue({
      price: BigInt(1000000), // 1 nAVAX
      capacity: BigInt(1000000),
      excess: BigInt(0),
    } as any);
    vi.mocked(getBaseFee).mockResolvedValue("25000000000"); // 25 gwei
    vi.mocked(getTransactionCount).mockResolvedValue(0);
    vi.mocked(getBalance).mockResolvedValue(BigInt(10e18)); // 10 AVAX
    vi.mocked(evm.estimateExportCost).mockReturnValue(BigInt(1000000)); // 1 nAVAX
    vi.mocked(prepareImportTxnPChain).mockResolvedValue({
      tx: mockPChainImportTx,
      importTx: mockPChainImportBaseTx,
      chainAlias: "P",
    } as any);
    vi.mocked(pvm.calculateFee).mockReturnValue(BigInt(1000000)); // 1 nAVAX
    vi.mocked(sendXPTransaction).mockResolvedValue({
      txHash:
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      chainAlias: "C",
    } as any);
    vi.mocked(waitForTxn).mockResolvedValue(undefined);
  });

  describe("successful transfers", () => {
    test("transfers successfully with all required steps", async () => {
      const amount = BigInt(1e18); // 1 AVAX in wei
      const amountInNanoAvax = weiToNanoAvax(amount);
      const cChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const pChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: cChainExportTxHash,
          chainAlias: "C",
        } as any)
        .mockResolvedValueOnce({
          txHash: pChainImportTxHash,
          chainAlias: "P",
        } as any);

      const result = await transferCtoPChain(client as any, {
        to: toPChainAddress,
        amount,
      });

      expect(result).toEqual({
        txHashes: [
          {
            txHash: cChainExportTxHash,
            chainAlias: "C",
          },
          {
            txHash: pChainImportTxHash,
            chainAlias: "P",
          },
        ],
      });

      expect(getContextFromURI).toHaveBeenCalledWith(client);
      expect(getEVMAddressFromAccountOrClient).toHaveBeenCalledWith(
        client,
        undefined
      );
      expect(getBech32AddressFromAccountOrClient).toHaveBeenCalledWith(
        client,
        undefined,
        "P",
        "fuji"
      );
      expect(prepareExportTxnCChain).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          destinationChain: "P",
          fromAddress: fromEVMAddress,
          exportedOutput: {
            addresses: [fromPChainAddress],
            amount: amountInNanoAvax,
          },
          context: testContext,
        })
      );
      expect(getFeeState).toHaveBeenCalledWith(client.pChainClient);
      expect(getBaseFee).toHaveBeenCalledWith(client);
      expect(getTransactionCount).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          address: expect.stringContaining(fromEVMAddress.replace(/^0x/i, "")),
        })
      );
      expect(getBalance).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          address: expect.stringContaining(fromEVMAddress.replace(/^0x/i, "")),
        })
      );
      expect(evm.estimateExportCost).toHaveBeenCalled();
      expect(sendXPTransaction).toHaveBeenCalledTimes(2);
      expect(waitForTxn).toHaveBeenCalledTimes(2);
      expect(prepareImportTxnPChain).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          sourceChain: "C",
          importedOutput: {
            addresses: [toPChainAddress],
          },
          context: testContext,
        })
      );
    });

    test("uses provided context instead of fetching", async () => {
      const amount = BigInt(1e18);
      const cChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const pChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: cChainExportTxHash,
          chainAlias: "C",
        } as any)
        .mockResolvedValueOnce({
          txHash: pChainImportTxHash,
          chainAlias: "P",
        } as any);

      await transferCtoPChain(client as any, {
        to: toPChainAddress,
        amount,
        context: testContext,
      });

      expect(getContextFromURI).not.toHaveBeenCalled();
      expect(prepareExportTxnCChain).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          context: testContext,
        })
      );
      expect(prepareImportTxnPChain).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          context: testContext,
        })
      );
    });

    test("uses provided account parameter", async () => {
      const amount = BigInt(1e18);
      const cChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const pChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: cChainExportTxHash,
          chainAlias: "C",
        } as any)
        .mockResolvedValueOnce({
          txHash: pChainImportTxHash,
          chainAlias: "P",
        } as any);

      await transferCtoPChain(client as any, {
        to: toPChainAddress,
        amount,
        account,
      });

      expect(getEVMAddressFromAccountOrClient).toHaveBeenCalledWith(
        client,
        account
      );
      expect(getBech32AddressFromAccountOrClient).toHaveBeenCalledWith(
        client,
        account,
        "P",
        "fuji"
      );
    });

    test("uses provided from address", async () => {
      const customFromAddress =
        "0x1111111111111111111111111111111111111111" as `0x${string}`;
      const amount = BigInt(1e18);
      const cChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const pChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: cChainExportTxHash,
          chainAlias: "C",
        } as any)
        .mockResolvedValueOnce({
          txHash: pChainImportTxHash,
          chainAlias: "P",
        } as any);

      await transferCtoPChain(client as any, {
        to: toPChainAddress,
        amount,
        from: customFromAddress,
      });

      expect(getEVMAddressFromAccountOrClient).not.toHaveBeenCalled();
      expect(prepareExportTxnCChain).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          fromAddress: customFromAddress,
        })
      );
      expect(getTransactionCount).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          address: expect.stringContaining(
            customFromAddress.replace(/^0x/i, "")
          ),
        })
      );
      expect(getBalance).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          address: expect.stringContaining(
            customFromAddress.replace(/^0x/i, "")
          ),
        })
      );
    });

    test("uses mainnet HRP when networkID is not 5", async () => {
      const mainnetContext = {
        ...testContext,
        networkID: 1,
      };
      const amount = BigInt(1e18);
      const cChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const pChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      vi.mocked(getContextFromURI).mockResolvedValue(mainnetContext);
      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: cChainExportTxHash,
          chainAlias: "C",
        } as any)
        .mockResolvedValueOnce({
          txHash: pChainImportTxHash,
          chainAlias: "P",
        } as any);

      await transferCtoPChain(client as any, {
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
        transferCtoPChain(client as any, {
          to: "X-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz" as any,
          amount,
        })
      ).rejects.toThrow("Invalid P chain address, it should start with P-");

      expect(prepareExportTxnCChain).not.toHaveBeenCalled();
      expect(sendXPTransaction).not.toHaveBeenCalled();
    });

    test("throws error when balance is insufficient", async () => {
      const amount = BigInt(1e18);
      const balance = amount - BigInt(1); // Less than amount

      vi.mocked(getBalance).mockResolvedValue(balance);

      await expect(
        transferCtoPChain(client as any, {
          to: toPChainAddress,
          amount,
          token: "AVAX",
        })
      ).rejects.toThrow(
        `Insufficient balance: ${amount} AVAX (in wei) is required, but only ${balance} AVAX (in wei) is available`
      );

      expect(sendXPTransaction).not.toHaveBeenCalled();
    });

    test("throws error when C-chain export fee is too high", async () => {
      const amount = BigInt(1e18);
      const amountInNanoAvax = weiToNanoAvax(amount);
      const cChainExportFee = amountInNanoAvax + BigInt(1); // Fee greater than amount

      vi.mocked(evm.estimateExportCost).mockReturnValue(cChainExportFee);

      await expect(
        transferCtoPChain(client as any, {
          to: toPChainAddress,
          amount,
        })
      ).rejects.toThrow(
        `Transfer amount is too low: ${cChainExportFee} nAVAX Fee is required for C chain export txn, but only ${amountInNanoAvax} nAVAX is being transferred, try sending a higher amount.`
      );

      expect(sendXPTransaction).not.toHaveBeenCalled();
    });

    test("throws error when total fee (export + import) is too high", async () => {
      const amount = BigInt(1e18);
      const amountInNanoAvax = weiToNanoAvax(amount);
      const cChainExportFee = BigInt(500000); // 0.5 nAVAX
      const pChainImportFee = amountInNanoAvax - BigInt(400000); // Makes total > amount
      const cChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

      vi.mocked(evm.estimateExportCost).mockReturnValue(cChainExportFee);
      vi.mocked(pvm.calculateFee).mockReturnValue(pChainImportFee);
      vi.mocked(sendXPTransaction).mockResolvedValueOnce({
        txHash: cChainExportTxHash,
        chainAlias: "C",
      } as any);

      await expect(
        transferCtoPChain(client as any, {
          to: toPChainAddress,
          amount,
        })
      ).rejects.toThrow(
        `Transfer amount is too low: ${pChainImportFee} nAVAX Fee is required for P chain import txn`
      );

      expect(sendXPTransaction).toHaveBeenCalledTimes(1); // Only export tx was sent
      expect(waitForTxn).toHaveBeenCalledTimes(1); // Only export tx was waited for
    });
  });

  describe("parallel API calls", () => {
    test("calls prepareExportTxn, getFeeState, getBaseFee, getTransactionCount, and getBalance in parallel", async () => {
      const amount = BigInt(1e18);
      const cChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const pChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      let prepareExportTxnCalled = false;
      let getFeeStateCalled = false;
      let getBaseFeeCalled = false;
      let getTransactionCountCalled = false;
      let getBalanceCalled = false;

      vi.mocked(prepareExportTxnCChain).mockImplementation(async () => {
        prepareExportTxnCalled = true;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return {
          tx: mockCChainExportTx,
          exportTx: mockCChainExportBaseTx,
          chainAlias: "C",
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
        return "25000000000";
      });

      vi.mocked(getTransactionCount).mockImplementation(async () => {
        getTransactionCountCalled = true;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return 0;
      });

      vi.mocked(getBalance).mockImplementation(async () => {
        getBalanceCalled = true;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return BigInt(10e18);
      });

      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: cChainExportTxHash,
          chainAlias: "C",
        } as any)
        .mockResolvedValueOnce({
          txHash: pChainImportTxHash,
          chainAlias: "P",
        } as any);

      await transferCtoPChain(client as any, {
        to: toPChainAddress,
        amount,
      });

      // All five should be called
      expect(prepareExportTxnCalled).toBe(true);
      expect(getFeeStateCalled).toBe(true);
      expect(getBaseFeeCalled).toBe(true);
      expect(getTransactionCountCalled).toBe(true);
      expect(getBalanceCalled).toBe(true);
    });
  });

  describe("return value", () => {
    test("returns correct structure with both txHashes and chainAliases", async () => {
      const amount = BigInt(1e18);
      const cChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const pChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: cChainExportTxHash,
          chainAlias: "C",
        } as any)
        .mockResolvedValueOnce({
          txHash: pChainImportTxHash,
          chainAlias: "P",
        } as any);

      const result = await transferCtoPChain(client as any, {
        to: toPChainAddress,
        amount,
      });

      expect(result).toHaveProperty("txHashes");
      expect(Array.isArray(result.txHashes)).toBe(true);
      expect(result.txHashes).toHaveLength(2);
      expect(result.txHashes[0]).toHaveProperty("txHash", cChainExportTxHash);
      expect(result.txHashes[0]).toHaveProperty("chainAlias", "C");
      expect(result.txHashes[1]).toHaveProperty("txHash", pChainImportTxHash);
      expect(result.txHashes[1]).toHaveProperty("chainAlias", "P");
    });
  });

  describe("fee calculation", () => {
    test("calculates C-chain export fee correctly using evm.estimateExportCost", async () => {
      const amount = BigInt(1e18);
      const amountInNanoAvax = weiToNanoAvax(amount);
      const baseFee = "25000000000";
      const txCount = 5;
      const cChainExportFee = BigInt(2000000); // 2 nAVAX
      const cChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const pChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      vi.mocked(getBaseFee).mockResolvedValue(baseFee);
      vi.mocked(getTransactionCount).mockResolvedValue(txCount);
      vi.mocked(evm.estimateExportCost).mockReturnValue(cChainExportFee);
      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: cChainExportTxHash,
          chainAlias: "C",
        } as any)
        .mockResolvedValueOnce({
          txHash: pChainImportTxHash,
          chainAlias: "P",
        } as any);

      await transferCtoPChain(client as any, {
        to: toPChainAddress,
        amount,
      });

      expect(evm.estimateExportCost).toHaveBeenCalledWith(
        testContext,
        BigInt(baseFee),
        amountInNanoAvax,
        expect.anything(), // chainID
        expect.anything(), // fromAddress bytes
        expect.anything(), // toAddress bytes
        BigInt(txCount)
      );
    });

    test("calculates P-chain import fee correctly using pvm.calculateFee", async () => {
      const amount = BigInt(1e18);
      const pChainImportFee = BigInt(2000000); // 2 nAVAX
      const cChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const pChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      vi.mocked(pvm.calculateFee).mockReturnValue(pChainImportFee);
      vi.mocked(sendXPTransaction)
        .mockResolvedValueOnce({
          txHash: cChainExportTxHash,
          chainAlias: "C",
        } as any)
        .mockResolvedValueOnce({
          txHash: pChainImportTxHash,
          chainAlias: "P",
        } as any);

      await transferCtoPChain(client as any, {
        to: toPChainAddress,
        amount,
      });

      expect(pvm.calculateFee).toHaveBeenCalledWith(
        mockPChainImportBaseTx,
        testContext.platformFeeConfig.weights,
        BigInt(1000000) // feeState.price
      );
    });
  });

  describe("transaction sequencing", () => {
    test("sends C-chain export transaction before P-chain import", async () => {
      const amount = BigInt(1e18);
      const cChainExportTxHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const pChainImportTxHash =
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      const sendCalls: any[] = [];
      vi.mocked(sendXPTransaction).mockImplementation(
        async (client, params) => {
          sendCalls.push(params);
          if (sendCalls.length === 1) {
            return {
              txHash: cChainExportTxHash,
              chainAlias: "C",
            } as any;
          } else {
            return {
              txHash: pChainImportTxHash,
              chainAlias: "P",
            } as any;
          }
        }
      );

      await transferCtoPChain(client as any, {
        to: toPChainAddress,
        amount,
      });

      expect(sendCalls).toHaveLength(2);
      expect(sendCalls[0]).toMatchObject({
        tx: mockCChainExportTx,
        chainAlias: "C",
      });
      expect(sendCalls[1]).toMatchObject({
        tx: mockPChainImportTx,
        chainAlias: "P",
      });
      expect(prepareImportTxnPChain).toHaveBeenCalledAfter(
        vi.mocked(waitForTxn) as any
      );
    });
  });
});
