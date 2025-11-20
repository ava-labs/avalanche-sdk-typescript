import { beforeEach, describe, expect, test, vi } from "vitest";
import { privateKeyToAvalancheAccount } from "../../accounts/index.js";
import { avalanche } from "../../chains/index.js";
import { createAvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { signXPMessage } from "./signXPMessage.js";

const privateKey1ForTest =
  "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce";

const account = privateKeyToAvalancheAccount(privateKey1ForTest);
const testMessage = "Hello, world!";
const mockSignature =
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" as `0x${string}`;

// Mock parseAvalancheAccount
vi.mock("../../accounts/utils/parseAvalancheAccount.js", () => ({
  parseAvalancheAccount: vi.fn((account) => account),
}));

import { parseAvalancheAccount } from "../../accounts/utils/parseAvalancheAccount.js";

describe("signXPMessage", () => {
  let client: ReturnType<typeof createAvalancheWalletCoreClient>;
  const mockRequest = vi.fn();
  let mockXpAccount: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create a mock xpAccount
    mockXpAccount = {
      signMessage: vi.fn(async (message: string) => mockSignature),
      publicKey:
        "0x0245ae25e2903178ddc15a26bbaa05dc3c923aba8fb64d2443ea02d91589a22208",
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

    // Default: client has xpAccount
    client.xpAccount = mockXpAccount;
  });

  describe("when xpAccount exists", () => {
    test("signs message using xpAccount from client when account is not provided", async () => {
      const result = await signXPMessage(client as any, {
        message: testMessage,
      });

      expect(mockXpAccount.signMessage).toHaveBeenCalledWith(testMessage);
      expect(result).toEqual({ signature: mockSignature });
      expect(mockRequest).not.toHaveBeenCalled();
    });

    test("signs message using xpAccount from provided account", async () => {
      const accountWithXpAccount = {
        ...account,
        xpAccount: {
          signMessage: vi.fn(async (message: string) => mockSignature),
          publicKey:
            "0x0245ae25e2903178ddc15a26bbaa05dc3c923aba8fb64d2443ea02d91589a22208",
        },
      } as any;

      vi.mocked(parseAvalancheAccount).mockReturnValue(
        accountWithXpAccount as any
      );

      const result = await signXPMessage(client as any, {
        message: testMessage,
        account: accountWithXpAccount,
      });

      expect(accountWithXpAccount.xpAccount.signMessage).toHaveBeenCalledWith(
        testMessage
      );
      expect(result).toEqual({ signature: mockSignature });
      expect(mockRequest).not.toHaveBeenCalled();
      expect(mockXpAccount.signMessage).not.toHaveBeenCalled();
    });

    test("prefers xpAccount from provided account over client.xpAccount", async () => {
      const accountXpAccount = {
        signMessage: vi.fn(
          async (message: string) => "0xaccountSignature" as `0x${string}`
        ),
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

      const result = await signXPMessage(client as any, {
        message: testMessage,
        account: accountWithXpAccount,
      });

      expect(accountXpAccount.signMessage).toHaveBeenCalledWith(testMessage);
      expect(result).toEqual({ signature: "0xaccountSignature" });
      expect(mockXpAccount.signMessage).not.toHaveBeenCalled();
    });

    test("uses client.xpAccount when parsed account has no xpAccount", async () => {
      const accountWithoutXpAccount = {
        ...account,
        xpAccount: undefined,
      };

      vi.mocked(parseAvalancheAccount).mockReturnValue(
        accountWithoutXpAccount as any
      );

      const result = await signXPMessage(client as any, {
        message: testMessage,
        account: accountWithoutXpAccount,
      });

      expect(mockXpAccount.signMessage).toHaveBeenCalledWith(testMessage);
      expect(result).toEqual({ signature: mockSignature });
      expect(mockRequest).not.toHaveBeenCalled();
    });

    test("handles different message types", async () => {
      const messages = [
        "Simple message",
        "Message with special chars: !@#$%^&*()",
        "Message with numbers: 1234567890",
        "Empty string",
        "Very long message ".repeat(100),
      ];

      for (const message of messages) {
        mockXpAccount.signMessage.mockClear();
        mockXpAccount.signMessage.mockResolvedValue(mockSignature);
        const result = await signXPMessage(client as any, { message });
        expect(mockXpAccount.signMessage).toHaveBeenCalledWith(message);
        expect(result.signature).toBe(mockSignature);
      }
    });
  });

  describe("when xpAccount does not exist (RPC path)", () => {
    test("makes RPC request when no xpAccount is available", async () => {
      // Create a client without account to ensure no xpAccount
      const clientWithoutXpAccount = createAvalancheWalletCoreClient({
        chain: avalanche,
        transport: {
          type: "custom",
          provider: {
            request: mockRequest,
          },
        },
        account: undefined,
      } as any);
      // Explicitly set to undefined to ensure RPC path
      (clientWithoutXpAccount as any).xpAccount = undefined;

      const rpcSignature = { signature: "0xrpcsignature" };

      mockRequest.mockClear();
      mockRequest.mockResolvedValue(rpcSignature);

      const result = await signXPMessage(clientWithoutXpAccount as any, {
        message: testMessage,
      });

      expect(mockRequest).toHaveBeenCalledWith({
        method: "avalanche_signMessage",
        params: {
          message: testMessage,
          accountIndex: undefined,
        },
      });
      expect(result).toEqual(rpcSignature);
      expect(mockXpAccount.signMessage).not.toHaveBeenCalled();
    });

    test("passes accountIndex to RPC request", async () => {
      // Create a client without account to ensure no xpAccount
      const clientWithoutXpAccount = createAvalancheWalletCoreClient({
        chain: avalanche,
        transport: {
          type: "custom",
          provider: {
            request: mockRequest,
          },
        },
        account: undefined,
      } as any);
      // Explicitly set to undefined to ensure RPC path
      (clientWithoutXpAccount as any).xpAccount = undefined;

      const accountIndex = 5;
      const rpcSignature = { signature: "0xrpcsignature" };

      mockRequest.mockClear();
      mockRequest.mockResolvedValue(rpcSignature);

      const result = await signXPMessage(clientWithoutXpAccount as any, {
        message: testMessage,
        accountIndex,
      });

      expect(mockRequest).toHaveBeenCalledWith({
        method: "avalanche_signMessage",
        params: {
          message: testMessage,
          accountIndex,
        },
      });
      expect(result).toEqual(rpcSignature);
    });

    test("omits account from RPC params", async () => {
      // Create a client without account to ensure no xpAccount
      const clientWithoutXpAccount = createAvalancheWalletCoreClient({
        chain: avalanche,
        transport: {
          type: "custom",
          provider: {
            request: mockRequest,
          },
        },
        account: undefined,
      } as any);
      // Explicitly set to undefined to ensure RPC path
      (clientWithoutXpAccount as any).xpAccount = undefined;

      const rpcSignature = { signature: "0xrpcsignature" };

      mockRequest.mockClear();
      mockRequest.mockResolvedValue(rpcSignature);

      await signXPMessage(clientWithoutXpAccount as any, {
        message: testMessage,
        account: account,
        accountIndex: 0,
      });

      expect(mockRequest).toHaveBeenCalledWith({
        method: "avalanche_signMessage",
        params: {
          message: testMessage,
          accountIndex: 0,
        },
      });
      // Verify account is not in params
      const callArgs = mockRequest.mock.calls[0][0];
      expect(callArgs.params).not.toHaveProperty("account");
    });
  });

  describe("parameter handling", () => {
    test("handles account parameter correctly", async () => {
      const accountWithXpAccount = {
        ...account,
        xpAccount: {
          signMessage: vi.fn(async (message: string) => mockSignature),
          publicKey:
            "0x0245ae25e2903178ddc15a26bbaa05dc3c923aba8fb64d2443ea02d91589a22208",
        },
      } as any;

      vi.mocked(parseAvalancheAccount).mockReturnValue(
        accountWithXpAccount as any
      );

      await signXPMessage(client as any, {
        message: testMessage,
        account: accountWithXpAccount,
      });

      expect(parseAvalancheAccount).toHaveBeenCalledWith(accountWithXpAccount);
    });

    test("handles undefined account parameter", async () => {
      // Reset call history but restore implementation
      vi.mocked(parseAvalancheAccount).mockClear();
      // Ensure parseAvalancheAccount returns undefined for undefined input
      vi.mocked(parseAvalancheAccount).mockReturnValue(undefined as any);
      mockXpAccount.signMessage.mockClear();
      mockXpAccount.signMessage.mockResolvedValue(mockSignature);

      await signXPMessage(client as any, {
        message: testMessage,
      });

      expect(parseAvalancheAccount).toHaveBeenCalledWith(undefined);
      expect(mockXpAccount.signMessage).toHaveBeenCalledWith(testMessage);
    });

    test("handles accountIndex parameter in RPC path", async () => {
      // Create a client without account to ensure no xpAccount
      const clientWithoutXpAccount = createAvalancheWalletCoreClient({
        chain: avalanche,
        transport: {
          type: "custom",
          provider: {
            request: mockRequest,
          },
        },
        account: undefined,
      } as any);
      // Explicitly set to undefined to ensure RPC path
      (clientWithoutXpAccount as any).xpAccount = undefined;
      // Ensure parseAvalancheAccount returns undefined for no account
      vi.mocked(parseAvalancheAccount).mockReturnValue(undefined as any);

      const accountIndex = 3;
      const rpcSignature = { signature: "0xrpcsignature" };

      mockRequest.mockClear();
      mockRequest.mockResolvedValue(rpcSignature);

      await signXPMessage(clientWithoutXpAccount as any, {
        message: testMessage,
        accountIndex,
      });

      expect(mockRequest).toHaveBeenCalledWith({
        method: "avalanche_signMessage",
        params: {
          message: testMessage,
          accountIndex: 3,
        },
      });
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe("return value", () => {
    test("returns signature in correct format when using xpAccount", async () => {
      const result = await signXPMessage(client as any, {
        message: testMessage,
      });

      expect(result).toHaveProperty("signature");
      expect(typeof result.signature).toBe("string");
      expect(result.signature).toBe(mockSignature);
    });

    test("returns signature in correct format when using RPC", async () => {
      // Create a client without account to ensure no xpAccount
      const clientWithoutXpAccount = createAvalancheWalletCoreClient({
        chain: avalanche,
        transport: {
          type: "custom",
          provider: {
            request: mockRequest,
          },
        },
        account: undefined,
      } as any);
      // Explicitly set to undefined to ensure RPC path
      (clientWithoutXpAccount as any).xpAccount = undefined;
      // Ensure parseAvalancheAccount returns undefined for no account
      vi.mocked(parseAvalancheAccount).mockReturnValue(undefined as any);

      const rpcSignature = { signature: "0xrpcsignature" };

      mockRequest.mockClear();
      mockRequest.mockResolvedValue(rpcSignature);

      const result = await signXPMessage(clientWithoutXpAccount as any, {
        message: testMessage,
      });

      expect(result).toHaveProperty("signature");
      expect(typeof result.signature).toBe("string");
      expect(result.signature).toBe("0xrpcsignature");
    });
  });

  describe("edge cases", () => {
    test("handles empty message", async () => {
      // Reset call history but restore implementation
      mockXpAccount.signMessage.mockClear();
      mockXpAccount.signMessage.mockResolvedValue(mockSignature);

      const result = await signXPMessage(client as any, {
        message: "",
      });

      expect(mockXpAccount.signMessage).toHaveBeenCalledWith("");
      expect(result).toEqual({ signature: mockSignature });
    });

    test("handles account with Address type", async () => {
      const address =
        "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" as `0x${string}`;
      const parsedAccount = {
        evmAccount: { address },
        xpAccount: undefined,
      };

      vi.mocked(parseAvalancheAccount).mockReturnValue(parsedAccount as any);

      // Should fall back to client.xpAccount
      const result = await signXPMessage(client as any, {
        message: testMessage,
        account: address,
      });

      expect(parseAvalancheAccount).toHaveBeenCalledWith(address);
      expect(mockXpAccount.signMessage).toHaveBeenCalledWith(testMessage);
      expect(result).toEqual({ signature: mockSignature });
    });

    test("handles accountIndex as 0", async () => {
      client.xpAccount = undefined;
      const rpcSignature = { signature: "0xrpcsignature" };

      mockRequest.mockResolvedValue(rpcSignature);

      await signXPMessage(client as any, {
        message: testMessage,
        accountIndex: 0,
      });

      expect(mockRequest).toHaveBeenCalledWith({
        method: "avalanche_signMessage",
        params: {
          message: testMessage,
          accountIndex: 0,
        },
      });
    });
  });

  describe("account resolution priority", () => {
    test("uses account.xpAccount when both account and client have xpAccount", async () => {
      const accountXpAccount = {
        signMessage: vi.fn(
          async (message: string) => "0xaccount" as `0x${string}`
        ),
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

      const result = await signXPMessage(client as any, {
        message: testMessage,
        account: accountWithXpAccount,
      });

      expect(accountXpAccount.signMessage).toHaveBeenCalled();
      expect(mockXpAccount.signMessage).not.toHaveBeenCalled();
      expect(result.signature).toBe("0xaccount");
    });

    test("falls back to client.xpAccount when account has no xpAccount", async () => {
      const accountWithoutXpAccount = {
        ...account,
        xpAccount: undefined,
      };

      vi.mocked(parseAvalancheAccount).mockReturnValue(
        accountWithoutXpAccount as any
      );

      const result = await signXPMessage(client as any, {
        message: testMessage,
        account: accountWithoutXpAccount,
      });

      expect(mockXpAccount.signMessage).toHaveBeenCalled();
      expect(result.signature).toBe(mockSignature);
    });

    test("uses RPC when neither account nor client have xpAccount", async () => {
      client.xpAccount = undefined;
      const accountWithoutXpAccount = {
        ...account,
        xpAccount: undefined,
      };

      vi.mocked(parseAvalancheAccount).mockReturnValue(
        accountWithoutXpAccount as any
      );
      const rpcSignature = { signature: "0xrpcsignature" };
      mockRequest.mockResolvedValue(rpcSignature);

      const result = await signXPMessage(client as any, {
        message: testMessage,
        account: accountWithoutXpAccount,
      });

      expect(mockRequest).toHaveBeenCalled();
      expect(result).toEqual(rpcSignature);
    });
  });
});
