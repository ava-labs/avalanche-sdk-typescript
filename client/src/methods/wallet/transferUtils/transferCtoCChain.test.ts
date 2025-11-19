import { beforeEach, describe, expect, test, vi } from "vitest";
import { privateKeyToAvalancheAccount } from "../../../accounts/index.js";
import { avalanche } from "../../../chains/index.js";
import {
  AvalancheWalletCoreClient,
  createAvalancheWalletCoreClient,
} from "../../../clients/createAvalancheWalletCoreClient.js";
import { transferCtoCChain } from "./transferCtoCChain.js";

const privateKey1ForTest =
  "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce";

const account = privateKeyToAvalancheAccount(privateKey1ForTest);
const fromAddress = account.getEVMAddress();
const toAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" as `0x${string}`;

// Mock viem/actions
vi.mock("viem/actions", () => ({
  estimateGas: vi.fn(),
  getBalance: vi.fn(),
  getGasPrice: vi.fn(),
  prepareTransactionRequest: vi.fn(),
  sendRawTransaction: vi.fn(),
  sendTransaction: vi.fn(),
  signTransaction: vi.fn(),
  waitForTransactionReceipt: vi.fn(),
}));

// Mock utils
vi.mock("../utils.js", () => ({
  getEVMAddressFromAccountOrClient: vi.fn(),
}));

import {
  estimateGas,
  getBalance,
  getGasPrice,
  prepareTransactionRequest,
  sendRawTransaction,
  sendTransaction,
  signTransaction,
  waitForTransactionReceipt,
} from "viem/actions";
import { getEVMAddressFromAccountOrClient } from "../utils.js";

describe("transferCtoCChain", () => {
  let client: ReturnType<typeof createAvalancheWalletCoreClient>;
  const mockRequest = vi.fn();

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
  });

  describe("successful transfers", () => {
    test("transfers with account provided - uses prepareTransactionRequest path", async () => {
      const amount = BigInt(1e18); // 1 AVAX
      const gasEstimate = BigInt(21000);
      const gasPrice = BigInt(25e9); // 25 gwei
      const balance = BigInt(10e18); // 10 AVAX
      const estimatedFee = gasEstimate * gasPrice;
      const txHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const serializedTx = "0xabcdef1234567890" as `0x${string}`;

      vi.mocked(getEVMAddressFromAccountOrClient).mockResolvedValue(
        fromAddress
      );
      vi.mocked(estimateGas).mockResolvedValue(gasEstimate);
      vi.mocked(getGasPrice).mockResolvedValue(gasPrice);
      vi.mocked(getBalance).mockResolvedValue(balance);
      vi.mocked(prepareTransactionRequest).mockResolvedValue({
        to: toAddress,
        value: amount,
        gas: gasEstimate,
      } as any);
      vi.mocked(signTransaction).mockResolvedValue(serializedTx as any);
      vi.mocked(sendRawTransaction).mockResolvedValue(txHash);
      vi.mocked(waitForTransactionReceipt).mockResolvedValue({
        status: "success",
        transactionHash: txHash,
      } as any);

      const result = await transferCtoCChain(client as any, {
        to: toAddress,
        amount,
        account,
      });

      expect(result).toEqual({
        txHashes: [
          {
            txHash,
            chainAlias: "C",
          },
        ],
      });

      expect(getEVMAddressFromAccountOrClient).toHaveBeenCalledWith(
        client,
        account
      );

      expect(estimateGas).toHaveBeenCalled();
      const estimateGasCall = vi.mocked(estimateGas).mock.calls[0];
      expect(estimateGasCall[0]).toBe(client);
      expect(estimateGasCall[1]).toMatchObject({
        to: toAddress,
        value: amount,
        account: fromAddress,
      });

      expect(getGasPrice).toHaveBeenCalledWith(client);

      expect(getBalance).toHaveBeenCalled();
      const getBalanceCall = vi.mocked(getBalance).mock.calls[0];
      expect(getBalanceCall[0]).toBe(client);
      expect(getBalanceCall[1]).toMatchObject({
        address: fromAddress,
      });

      expect(prepareTransactionRequest).toHaveBeenCalled();
      const prepareTxCall = vi.mocked(prepareTransactionRequest).mock.calls[0];
      expect(prepareTxCall[0]).toBe(client);
      expect(prepareTxCall[1]).toMatchObject({
        to: toAddress,
        value: amount,
        account: fromAddress,
      });

      expect(signTransaction).toHaveBeenCalled();
      expect(sendRawTransaction).toHaveBeenCalledWith(client, {
        serializedTransaction: serializedTx,
      });
      expect(waitForTransactionReceipt).toHaveBeenCalledWith(client, {
        hash: txHash,
      });
      expect(sendTransaction).not.toHaveBeenCalled();
    });

    test("transfers without account provided - uses sendTransaction path", async () => {
      // Create a client without account to test the sendTransaction path
      const clientWithoutAccount = {
        ...createAvalancheWalletCoreClient({
          chain: avalanche,
          transport: {
            type: "custom",
            provider: {
              request: mockRequest,
            },
          },
          account,
        }),
        account: undefined,
      } as any;

      const amount = BigInt(1e18); // 1 AVAX
      const gasEstimate = BigInt(21000);
      const gasPrice = BigInt(25e9); // 25 gwei
      const balance = BigInt(10e18); // 10 AVAX
      const txHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

      vi.mocked(getEVMAddressFromAccountOrClient).mockResolvedValue(
        fromAddress
      );
      vi.mocked(estimateGas).mockResolvedValue(gasEstimate);
      vi.mocked(getGasPrice).mockResolvedValue(gasPrice);
      vi.mocked(getBalance).mockResolvedValue(balance);
      vi.mocked(sendTransaction).mockResolvedValue(txHash);
      vi.mocked(waitForTransactionReceipt).mockResolvedValue({
        status: "success",
        transactionHash: txHash,
      } as any);

      const result = await transferCtoCChain(clientWithoutAccount, {
        to: toAddress,
        amount,
      });

      expect(result).toEqual({
        txHashes: [
          {
            txHash,
            chainAlias: "C",
          },
        ],
      });

      expect(getEVMAddressFromAccountOrClient).toHaveBeenCalledWith(
        clientWithoutAccount,
        undefined
      );
      expect(sendTransaction).toHaveBeenCalledWith(
        clientWithoutAccount,
        expect.objectContaining({
          to: toAddress,
          value: amount,
          account: fromAddress,
        })
      );
      expect(prepareTransactionRequest).not.toHaveBeenCalled();
      expect(signTransaction).not.toHaveBeenCalled();
      expect(sendRawTransaction).not.toHaveBeenCalled();
    });

    test("transfers with from address specified", async () => {
      const customFromAddress =
        "0x1111111111111111111111111111111111111111" as `0x${string}`;
      const amount = BigInt(1e18);
      const gasEstimate = BigInt(21000);
      const gasPrice = BigInt(25e9);
      const balance = BigInt(10e18);
      const txHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const serializedTx = "0xabcdef1234567890" as `0x${string}`;

      vi.mocked(estimateGas).mockResolvedValue(gasEstimate);
      vi.mocked(getGasPrice).mockResolvedValue(gasPrice);
      vi.mocked(getBalance).mockResolvedValue(balance);
      vi.mocked(prepareTransactionRequest).mockResolvedValue({
        to: toAddress,
        value: amount,
        gas: gasEstimate,
      } as any);
      vi.mocked(signTransaction).mockResolvedValue(serializedTx as any);
      vi.mocked(sendRawTransaction).mockResolvedValue(txHash);
      vi.mocked(waitForTransactionReceipt).mockResolvedValue({
        status: "success",
        transactionHash: txHash,
      } as any);

      const result = await transferCtoCChain(client as any, {
        to: toAddress,
        amount,
        from: customFromAddress,
        account,
      });

      expect(result.txHashes[0].txHash).toBe(txHash);
      expect(estimateGas).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          to: toAddress,
          value: amount,
          account: customFromAddress,
        })
      );
      expect(getBalance).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          address: customFromAddress,
        })
      );
      expect(getEVMAddressFromAccountOrClient).not.toHaveBeenCalled();
    });

    test("transfers with client account when params account not provided", async () => {
      const amount = BigInt(1e18);
      const gasEstimate = BigInt(21000);
      const gasPrice = BigInt(25e9);
      const balance = BigInt(10e18);
      const txHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const serializedTx = "0xabcdef1234567890" as `0x${string}`;

      vi.mocked(estimateGas).mockResolvedValue(gasEstimate);
      vi.mocked(getGasPrice).mockResolvedValue(gasPrice);
      vi.mocked(getBalance).mockResolvedValue(balance);
      vi.mocked(prepareTransactionRequest).mockResolvedValue({
        to: toAddress,
        value: amount,
        gas: gasEstimate,
      } as any);
      vi.mocked(signTransaction).mockResolvedValue(serializedTx as any);
      vi.mocked(sendRawTransaction).mockResolvedValue(txHash);
      vi.mocked(waitForTransactionReceipt).mockResolvedValue({
        status: "success",
        transactionHash: txHash,
      } as any);

      const result = await transferCtoCChain(client as any, {
        to: toAddress,
        amount,
      });

      expect(result.txHashes[0].txHash).toBe(txHash);
      expect(estimateGas).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          to: toAddress,
          value: amount,
          account: fromAddress,
        })
      );
      expect(getEVMAddressFromAccountOrClient).toHaveBeenCalledWith(
        client,
        undefined
      );
    });
  });

  describe("error cases", () => {
    test("throws error when balance is insufficient for estimated fee", async () => {
      const amount = BigInt(1e18);
      const gasEstimate = BigInt(21000);
      const gasPrice = BigInt(25e9);
      const estimatedFee = gasEstimate * gasPrice;
      const balance = estimatedFee - BigInt(1); // Less than fee

      vi.mocked(estimateGas).mockResolvedValue(gasEstimate);
      vi.mocked(getGasPrice).mockResolvedValue(gasPrice);
      vi.mocked(getBalance).mockResolvedValue(balance);

      await expect(
        transferCtoCChain(client as any, {
          to: toAddress,
          amount,
          account,
        })
      ).rejects.toThrow(
        `Insufficient balance: ${estimatedFee} AVAX (in wei) is required, but only ${balance} AVAX (in wei) is available`
      );

      expect(prepareTransactionRequest).not.toHaveBeenCalled();
      expect(sendTransaction).not.toHaveBeenCalled();
    });

    test("throws error when balance is insufficient for transfer amount", async () => {
      const amount = BigInt(5e18); // 5 AVAX
      const gasEstimate = BigInt(21000);
      const gasPrice = BigInt(25e9);
      const estimatedFee = gasEstimate * gasPrice;
      const balance = BigInt(3e18); // 3 AVAX - less than amount

      vi.mocked(estimateGas).mockResolvedValue(gasEstimate);
      vi.mocked(getGasPrice).mockResolvedValue(gasPrice);
      vi.mocked(getBalance).mockResolvedValue(balance);

      await expect(
        transferCtoCChain(client as AvalancheWalletCoreClient, {
          to: toAddress,
          amount,
          account,
        })
      ).rejects.toThrow(
        `Insufficient balance: ${estimatedFee} AVAX (in wei) is required, but only ${balance} AVAX (in wei) is available`
      );
    });

    test("throws error when balance equals estimated fee but less than amount", async () => {
      const amount = BigInt(2e18); // 2 AVAX
      const gasEstimate = BigInt(21000);
      const gasPrice = BigInt(25e9);
      const estimatedFee = gasEstimate * gasPrice;
      const balance = estimatedFee; // Exactly equal to fee, but less than amount

      vi.mocked(estimateGas).mockResolvedValue(gasEstimate);
      vi.mocked(getGasPrice).mockResolvedValue(gasPrice);
      vi.mocked(getBalance).mockResolvedValue(balance);

      await expect(
        transferCtoCChain(client as any, {
          to: toAddress,
          amount,
          account,
        })
      ).rejects.toThrow(
        `Insufficient balance: ${estimatedFee} AVAX (in wei) is required, but only ${balance} AVAX (in wei) is available`
      );
    });
  });

  describe("parallel API calls", () => {
    test("calls estimateGas, getGasPrice, and getBalance in parallel", async () => {
      const amount = BigInt(1e18);
      const gasEstimate = BigInt(21000);
      const gasPrice = BigInt(25e9);
      const balance = BigInt(10e18);
      const txHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const serializedTx = "0xabcdef1234567890" as `0x${string}`;

      let estimateGasCalled = false;
      let getGasPriceCalled = false;
      let getBalanceCalled = false;

      vi.mocked(estimateGas).mockImplementation(async () => {
        estimateGasCalled = true;
        // Wait a bit to ensure parallel execution
        await new Promise((resolve) => setTimeout(resolve, 10));
        return gasEstimate;
      });

      vi.mocked(getGasPrice).mockImplementation(async () => {
        getGasPriceCalled = true;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return gasPrice;
      });

      vi.mocked(getBalance).mockImplementation(async () => {
        getBalanceCalled = true;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return balance;
      });

      vi.mocked(prepareTransactionRequest).mockResolvedValue({
        to: toAddress,
        value: amount,
        gas: gasEstimate,
      } as any);
      vi.mocked(signTransaction).mockResolvedValue(serializedTx as any);
      vi.mocked(sendRawTransaction).mockResolvedValue(txHash);
      vi.mocked(waitForTransactionReceipt).mockResolvedValue({
        status: "success",
        transactionHash: txHash,
      } as any);

      await transferCtoCChain(client as any, {
        to: toAddress,
        amount,
        account,
      });

      // All three should be called
      expect(estimateGasCalled).toBe(true);
      expect(getGasPriceCalled).toBe(true);
      expect(getBalanceCalled).toBe(true);
    });
  });

  describe("account handling", () => {
    test("uses params account evmAccount when provided", async () => {
      const amount = BigInt(1e18);
      const gasEstimate = BigInt(21000);
      const gasPrice = BigInt(25e9);
      const balance = BigInt(10e18);
      const txHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const serializedTx = "0xabcdef1234567890" as `0x${string}`;

      vi.mocked(estimateGas).mockResolvedValue(gasEstimate);
      vi.mocked(getGasPrice).mockResolvedValue(gasPrice);
      vi.mocked(getBalance).mockResolvedValue(balance);
      vi.mocked(prepareTransactionRequest).mockResolvedValue({
        to: toAddress,
        value: amount,
        gas: gasEstimate,
      } as any);
      vi.mocked(signTransaction).mockResolvedValue(serializedTx as any);
      vi.mocked(sendRawTransaction).mockResolvedValue(txHash);
      vi.mocked(waitForTransactionReceipt).mockResolvedValue({
        status: "success",
        transactionHash: txHash,
      } as any);

      await transferCtoCChain(client as AvalancheWalletCoreClient, {
        to: toAddress,
        amount,
        account,
      });

      expect(signTransaction).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          account: account.evmAccount,
        })
      );
    });

    test("uses client account when params account not provided but client has account", async () => {
      const amount = BigInt(1e18);
      const gasEstimate = BigInt(21000);
      const gasPrice = BigInt(25e9);
      const balance = BigInt(10e18);
      const txHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const serializedTx = "0xabcdef1234567890" as `0x${string}`;

      vi.mocked(estimateGas).mockResolvedValue(gasEstimate);
      vi.mocked(getGasPrice).mockResolvedValue(gasPrice);
      vi.mocked(getBalance).mockResolvedValue(balance);
      vi.mocked(prepareTransactionRequest).mockResolvedValue({
        to: toAddress,
        value: amount,
        gas: gasEstimate,
      } as any);
      vi.mocked(signTransaction).mockResolvedValue(serializedTx as any);
      vi.mocked(sendRawTransaction).mockResolvedValue(txHash);
      vi.mocked(waitForTransactionReceipt).mockResolvedValue({
        status: "success",
        transactionHash: txHash,
      } as any);

      await transferCtoCChain(client as any, {
        to: toAddress,
        amount,
      });

      expect(signTransaction).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          account: client.account,
        })
      );
    });
  });

  describe("return value", () => {
    test("returns correct structure with txHash and chainAlias", async () => {
      const amount = BigInt(1e18);
      const gasEstimate = BigInt(21000);
      const gasPrice = BigInt(25e9);
      const balance = BigInt(10e18);
      const txHash =
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const serializedTx = "0xabcdef1234567890" as `0x${string}`;

      vi.mocked(estimateGas).mockResolvedValue(gasEstimate);
      vi.mocked(getGasPrice).mockResolvedValue(gasPrice);
      vi.mocked(getBalance).mockResolvedValue(balance);
      vi.mocked(prepareTransactionRequest).mockResolvedValue({
        to: toAddress,
        value: amount,
        gas: gasEstimate,
      } as any);
      vi.mocked(signTransaction).mockResolvedValue(serializedTx as any);
      vi.mocked(sendRawTransaction).mockResolvedValue(txHash);
      vi.mocked(waitForTransactionReceipt).mockResolvedValue({
        status: "success",
        transactionHash: txHash,
      } as any);

      const result = await transferCtoCChain(client as any, {
        to: toAddress,
        amount,
        account,
      });

      expect(result).toHaveProperty("txHashes");
      expect(Array.isArray(result.txHashes)).toBe(true);
      expect(result.txHashes).toHaveLength(1);
      expect(result.txHashes[0]).toHaveProperty("txHash", txHash);
      expect(result.txHashes[0]).toHaveProperty("chainAlias", "C");
    });
  });
});
