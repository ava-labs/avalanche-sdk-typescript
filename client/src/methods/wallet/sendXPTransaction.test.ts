import { beforeEach, describe, expect, test, vi } from "vitest";
import { privateKeyToAvalancheAccount } from "../../accounts/index.js";
import { avalanche } from "../../chains/index.js";
import { createAvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { sendXPTransaction } from "./sendXPTransaction.js";

const privateKey1ForTest =
  "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce";

const account = privateKeyToAvalancheAccount(privateKey1ForTest);
const testTxHex =
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
const mockTxID =
  "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";
const mockSignedTxHex =
  "0xsigned1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

// Mock dependencies
vi.mock("../../accounts/utils/parseAvalancheAccount.js", () => ({
  parseAvalancheAccount: vi.fn((account) => account),
}));

vi.mock("./signXPTransaction.js", () => ({
  signXPTransaction: vi.fn(),
}));

vi.mock("../pChain/issueTx.js", () => ({
  issueTx: vi.fn(),
}));

vi.mock("../cChain/issueTx.js", () => ({
  issueTx: vi.fn(),
}));

vi.mock("../xChain/issueTx.js", () => ({
  issueTx: vi.fn(),
}));

import { parseAvalancheAccount } from "../../accounts/utils/parseAvalancheAccount.js";
import { issueTx as issueTxCChain } from "../cChain/issueTx.js";
import { issueTx as issueTxPChain } from "../pChain/issueTx.js";
import { issueTx as issueTxXChain } from "../xChain/issueTx.js";
import { signXPTransaction } from "./signXPTransaction.js";

describe("sendXPTransaction", () => {
  let client: ReturnType<typeof createAvalancheWalletCoreClient>;
  const mockRequest = vi.fn();
  let mockXpAccount: any;
  let mockPChainClient: any;
  let mockCChainClient: any;
  let mockXChainClient: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock xpAccount
    mockXpAccount = {
      signMessage: vi.fn(),
      signTransaction: vi.fn(),
      publicKey:
        "0x0245ae25e2903178ddc15a26bbaa05dc3c923aba8fb64d2443ea02d91589a22208",
    };

    // Create mock chain clients
    mockPChainClient = { request: vi.fn() };
    mockCChainClient = { request: vi.fn() };
    mockXChainClient = { request: vi.fn() };

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

    // Set up client properties
    client.xpAccount = mockXpAccount;
    client.pChainClient = mockPChainClient as any;
    client.cChainClient = mockCChainClient as any;
    client.xChainClient = mockXChainClient as any;

    // Default mock return values
    vi.mocked(signXPTransaction).mockResolvedValue({
      signedTxHex: mockSignedTxHex,
      signatures: [],
      chainAlias: "P",
    } as any);

    vi.mocked(issueTxPChain).mockResolvedValue({
      txID: mockTxID,
    });

    vi.mocked(issueTxCChain).mockResolvedValue({
      txID: mockTxID,
    });

    vi.mocked(issueTxXChain).mockResolvedValue({
      txID: mockTxID,
    });
  });

  describe("when xpAccount exists", () => {
    test("sends transaction to P chain using xpAccount", async () => {
      const result = await sendXPTransaction(client as any, {
        tx: testTxHex,
        chainAlias: "P",
      });

      expect(signXPTransaction).toHaveBeenCalledWith(client, {
        tx: testTxHex,
        chainAlias: "P",
        subnetOwners: undefined,
        subnetAuth: undefined,
        disableOwners: undefined,
        disableAuth: undefined,
      });

      expect(issueTxPChain).toHaveBeenCalledWith(mockPChainClient, {
        tx: mockSignedTxHex,
        encoding: "hex",
      });

      expect(result).toEqual({
        txHash: mockTxID,
        chainAlias: "P",
      });
      expect(mockRequest).not.toHaveBeenCalled();
    });

    test("sends transaction to C chain using xpAccount", async () => {
      const result = await sendXPTransaction(client as any, {
        tx: testTxHex,
        chainAlias: "C",
      });

      expect(signXPTransaction).toHaveBeenCalledWith(client, {
        tx: testTxHex,
        chainAlias: "C",
        subnetOwners: undefined,
        subnetAuth: undefined,
        disableOwners: undefined,
        disableAuth: undefined,
      });

      expect(issueTxCChain).toHaveBeenCalledWith(mockCChainClient, {
        tx: mockSignedTxHex,
        encoding: "hex",
      });

      expect(result).toEqual({
        txHash: mockTxID,
        chainAlias: "C",
      });
      expect(issueTxPChain).not.toHaveBeenCalled();
      expect(issueTxXChain).not.toHaveBeenCalled();
    });

    test("sends transaction to X chain using xpAccount", async () => {
      const result = await sendXPTransaction(client as any, {
        tx: testTxHex,
        chainAlias: "X",
      });

      expect(signXPTransaction).toHaveBeenCalledWith(client, {
        tx: testTxHex,
        chainAlias: "X",
        subnetOwners: undefined,
        subnetAuth: undefined,
        disableOwners: undefined,
        disableAuth: undefined,
      });

      expect(issueTxXChain).toHaveBeenCalledWith(mockXChainClient, {
        tx: mockSignedTxHex,
        encoding: "hex",
      });

      expect(result).toEqual({
        txHash: mockTxID,
        chainAlias: "X",
      });
      expect(issueTxPChain).not.toHaveBeenCalled();
      expect(issueTxCChain).not.toHaveBeenCalled();
    });

    test("passes subnet parameters to signXPTransaction", async () => {
      const subnetAuth = [1, 2, 3];
      const subnetOwners = { threshold: 1, addresses: [] } as any;
      const disableOwners = { threshold: 2, addresses: [] } as any;
      const disableAuth = [4, 5, 6];

      await sendXPTransaction(client as any, {
        tx: testTxHex,
        chainAlias: "P",
        subnetAuth,
        subnetOwners,
        disableOwners,
        disableAuth,
      });

      expect(signXPTransaction).toHaveBeenCalledWith(client, {
        tx: testTxHex,
        chainAlias: "P",
        subnetAuth,
        subnetOwners,
        disableOwners,
        disableAuth,
      });
    });

    test("uses xpAccount from provided account", async () => {
      const accountWithXpAccount = {
        ...account,
        xpAccount: {
          signMessage: vi.fn(),
          signTransaction: vi.fn(),
          publicKey:
            "0x0245ae25e2903178ddc15a26bbaa05dc3c923aba8fb64d2443ea02d91589a22208",
        },
      } as any;

      vi.mocked(parseAvalancheAccount).mockReturnValue(
        accountWithXpAccount as any
      );

      await sendXPTransaction(client as any, {
        tx: testTxHex,
        chainAlias: "P",
        account: accountWithXpAccount,
      });

      expect(parseAvalancheAccount).toHaveBeenCalledWith(accountWithXpAccount);
      expect(signXPTransaction).toHaveBeenCalled();
    });

    test("uses client.xpAccount when account has no xpAccount", async () => {
      const accountWithoutXpAccount = {
        ...account,
        xpAccount: undefined,
      } as any;

      vi.mocked(parseAvalancheAccount).mockReturnValue(
        accountWithoutXpAccount as any
      );

      await sendXPTransaction(client as any, {
        tx: testTxHex,
        chainAlias: "P",
        account: accountWithoutXpAccount,
      });

      expect(signXPTransaction).toHaveBeenCalled();
      expect(mockRequest).not.toHaveBeenCalled();
    });
  });

  describe("when xpAccount does not exist (RPC path)", () => {
    test("makes RPC request when no xpAccount is available", async () => {
      client.xpAccount = undefined;
      const rpcTxHash = "0xrpctxhash";

      mockRequest.mockResolvedValue(rpcTxHash);

      const result = await sendXPTransaction(client as any, {
        tx: testTxHex,
        chainAlias: "P",
      });

      expect(mockRequest).toHaveBeenCalledWith({
        method: "avalanche_sendTransaction",
        params: {
          externalIndices: undefined,
          internalIndices: undefined,
          feeTolerance: undefined,
          transactionHex: testTxHex,
          chainAlias: "P",
          utxos: undefined,
        },
      });

      expect(result).toEqual({
        txHash: rpcTxHash,
        chainAlias: "P",
      });
      expect(signXPTransaction).not.toHaveBeenCalled();
      expect(issueTxPChain).not.toHaveBeenCalled();
    });

    test("converts UnsignedTx to hex string in RPC path", async () => {
      client.xpAccount = undefined;
      const mockBytes = new Uint8Array([1, 2, 3, 4]);
      const mockUnsignedTx = {
        toBytes: vi.fn(() => mockBytes),
      } as any;
      const rpcTxHash = "0xrpctxhash";

      mockRequest.mockResolvedValue(rpcTxHash);

      const result = await sendXPTransaction(client as any, {
        tx: mockUnsignedTx,
        chainAlias: "C",
      });

      expect(mockUnsignedTx.toBytes).toHaveBeenCalled();
      // Verify that bufferToHex was called (it's used internally)
      // The actual hex value will be computed by utils.bufferToHex
      expect(mockRequest).toHaveBeenCalledWith({
        method: "avalanche_sendTransaction",
        params: expect.objectContaining({
          transactionHex: expect.any(String),
          chainAlias: "C",
        }),
      });

      expect(result).toEqual({
        txHash: rpcTxHash,
        chainAlias: "C",
      });
    });

    test("passes all optional parameters to RPC request", async () => {
      client.xpAccount = undefined;
      const externalIndices = [0, 1];
      const internalIndices = [2, 3];
      const feeTolerance = 1.5;
      const utxoIds = ["utxo1", "utxo2"];
      const rpcTxHash = "0xrpctxhash";

      mockRequest.mockResolvedValue(rpcTxHash);

      const result = await sendXPTransaction(client as any, {
        tx: testTxHex,
        chainAlias: "X",
        externalIndices,
        internalIndices,
        feeTolerance,
        utxoIds,
      });

      expect(mockRequest).toHaveBeenCalledWith({
        method: "avalanche_sendTransaction",
        params: {
          externalIndices,
          internalIndices,
          feeTolerance,
          transactionHex: testTxHex,
          chainAlias: "X",
          utxos: utxoIds,
        },
      });

      expect(result).toEqual({
        txHash: rpcTxHash,
        chainAlias: "X",
      });
    });

    test("omits account, tx, and subnet parameters from RPC params", async () => {
      client.xpAccount = undefined;
      const rpcTxHash = "0xrpctxhash";

      mockRequest.mockResolvedValue(rpcTxHash);

      await sendXPTransaction(client as any, {
        tx: testTxHex,
        chainAlias: "P",
        account: account,
        utxoIds: ["utxo1"],
        subnetAuth: [1, 2],
        subnetOwners: { threshold: 1, addresses: [] } as any,
        disableOwners: { threshold: 2, addresses: [] } as any,
        disableAuth: [3, 4],
      });

      const callArgs = mockRequest.mock.calls[0][0];
      expect(callArgs.params).not.toHaveProperty("account");
      expect(callArgs.params).not.toHaveProperty("tx");
      expect(callArgs.params).not.toHaveProperty("subnetAuth");
      expect(callArgs.params).not.toHaveProperty("subnetOwners");
      expect(callArgs.params).not.toHaveProperty("disableOwners");
      expect(callArgs.params).not.toHaveProperty("disableAuth");
      expect(callArgs.params).toHaveProperty("utxos");
    });
  });

  describe("parameter handling", () => {
    test("handles tx as string", async () => {
      const result = await sendXPTransaction(client as any, {
        tx: testTxHex,
        chainAlias: "P",
      });

      expect(signXPTransaction).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          tx: testTxHex,
        })
      );
      expect(result.chainAlias).toBe("P");
    });

    test("handles tx as UnsignedTx object", async () => {
      const mockUnsignedTx = {
        toBytes: vi.fn(() => new Uint8Array([1, 2, 3])),
      } as any;

      await sendXPTransaction(client as any, {
        tx: mockUnsignedTx,
        chainAlias: "C",
      });

      expect(signXPTransaction).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          tx: mockUnsignedTx,
        })
      );
    });

    test("handles all chain aliases", async () => {
      const chains: Array<"P" | "C" | "X"> = ["P", "C", "X"];

      for (const chainAlias of chains) {
        vi.clearAllMocks();
        await sendXPTransaction(client as any, {
          tx: testTxHex,
          chainAlias,
        });

        expect(signXPTransaction).toHaveBeenCalledWith(
          client,
          expect.objectContaining({
            chainAlias,
          })
        );
      }
    });
  });

  describe("return value", () => {
    test("returns correct format when using xpAccount", async () => {
      const result = await sendXPTransaction(client as any, {
        tx: testTxHex,
        chainAlias: "P",
      });

      expect(result).toHaveProperty("txHash");
      expect(result).toHaveProperty("chainAlias");
      expect(typeof result.txHash).toBe("string");
      expect(result.chainAlias).toBe("P");
      expect(result.txHash).toBe(mockTxID);
    });

    test("returns correct format when using RPC", async () => {
      client.xpAccount = undefined;
      const rpcTxHash = "0xrpctxhash";

      mockRequest.mockResolvedValue(rpcTxHash);

      const result = await sendXPTransaction(client as any, {
        tx: testTxHex,
        chainAlias: "C",
      });

      expect(result).toHaveProperty("txHash");
      expect(result).toHaveProperty("chainAlias");
      expect(typeof result.txHash).toBe("string");
      expect(result.chainAlias).toBe("C");
      expect(result.txHash).toBe(rpcTxHash);
    });
  });

  describe("integration with signXPTransaction", () => {
    test("uses signedTxHex from signXPTransaction result", async () => {
      const customSignedTxHex = "0xcustomsigned";
      vi.mocked(signXPTransaction).mockResolvedValue({
        signedTxHex: customSignedTxHex,
        signatures: [],
        chainAlias: "P",
      } as any);

      await sendXPTransaction(client as any, {
        tx: testTxHex,
        chainAlias: "P",
      });

      expect(issueTxPChain).toHaveBeenCalledWith(mockPChainClient, {
        tx: customSignedTxHex,
        encoding: "hex",
      });
    });

    test("handles signXPTransaction with all subnet parameters", async () => {
      const subnetAuth = [1, 2];
      const subnetOwners = { threshold: 1, addresses: [] } as any;
      const disableOwners = { threshold: 2, addresses: [] } as any;
      const disableAuth = [3, 4];

      await sendXPTransaction(client as any, {
        tx: testTxHex,
        chainAlias: "P",
        subnetAuth,
        subnetOwners,
        disableOwners,
        disableAuth,
      });

      expect(signXPTransaction).toHaveBeenCalledWith(client, {
        tx: testTxHex,
        chainAlias: "P",
        subnetAuth,
        subnetOwners,
        disableOwners,
        disableAuth,
      });
    });
  });

  describe("edge cases", () => {
    test("handles undefined optional parameters", async () => {
      await sendXPTransaction(client as any, {
        tx: testTxHex,
        chainAlias: "P",
      });

      expect(signXPTransaction).toHaveBeenCalledWith(client, {
        tx: testTxHex,
        chainAlias: "P",
        subnetOwners: undefined,
        subnetAuth: undefined,
        disableOwners: undefined,
        disableAuth: undefined,
      });
    });

    test("handles empty utxoIds array in RPC path", async () => {
      client.xpAccount = undefined;
      const rpcTxHash = "0xrpctxhash";

      mockRequest.mockResolvedValue(rpcTxHash);

      await sendXPTransaction(client as any, {
        tx: testTxHex,
        chainAlias: "P",
        utxoIds: [],
      });

      expect(mockRequest).toHaveBeenCalledWith({
        method: "avalanche_sendTransaction",
        params: expect.objectContaining({
          utxos: [],
        }),
      });
    });

    test("handles account resolution priority", async () => {
      const accountXpAccount = {
        signMessage: vi.fn(),
        signTransaction: vi.fn(),
        publicKey:
          "0x0245ae25e2903178ddc15a26bbaa05dc3c923aba8fb64d2443ea02d91589a22208",
      };

      const accountWithXpAccount = {
        ...account,
        xpAccount: accountXpAccount,
      } as any;

      vi.mocked(parseAvalancheAccount).mockReturnValue(
        accountWithXpAccount as any
      );

      await sendXPTransaction(client as any, {
        tx: testTxHex,
        chainAlias: "P",
        account: accountWithXpAccount,
      });

      // Should use account.xpAccount, not client.xpAccount
      expect(parseAvalancheAccount).toHaveBeenCalledWith(accountWithXpAccount);
      expect(signXPTransaction).toHaveBeenCalled();
    });
  });
});
