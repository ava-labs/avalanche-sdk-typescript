import { Chain, HttpTransport } from "viem";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { avalanche } from "../chains/index.js";
import { SDK_METADATA } from "./common.js";
import { ClientType } from "./types/types.js";
import { createAvalancheTransportClient } from "./utils.js";

// Mock viem transport functions
vi.mock("viem", async () => {
  const actual = await vi.importActual("viem");
  return {
    ...actual,
    http: vi.fn((url, config) => ({
      type: "http",
      url,
      config,
      key: "http",
      name: "HTTP JSON-RPC",
    })),
    webSocket: vi.fn((url, config) => ({
      type: "ws",
      url,
      config,
      key: "ws",
      name: "WebSocket JSON-RPC",
    })),
    custom: vi.fn((provider, config) => ({
      type: "custom",
      provider,
      config,
      key: "custom",
      name: "Custom",
    })),
    fallback: vi.fn((transports, config) => ({
      type: "fallback",
      transports,
      config,
      key: "fallback",
      name: "Fallback",
    })),
  };
});

describe("createAvalancheTransportClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("HTTP transport", () => {
    test("creates HTTP transport with URL", () => {
      const transport = createAvalancheTransportClient<HttpTransport>(
        {
          type: "http",
          url: "https://api-test.avax.network/ext/bc/C/rpc",
        },
        avalanche,
        {},
        "public"
      );
      expect((transport as any).type).toBe("http");
      expect((transport as any).config.fetchOptions).toMatchObject({});
      expect((transport as any).url).toBe(
        "https://api-test.avax.network/ext/bc/C/rpc"
      );
    });

    test("creates HTTP transport with chain and no URL", () => {
      const transport = createAvalancheTransportClient(
        {
          type: "http",
        },
        avalanche
      );

      expect((transport as any).type).toBe("http");
      expect((transport as any).url).toBe(
        "https://api.avax.network/ext/bc/C/rpc"
      );
    });

    test("creates HTTP transport with API key", () => {
      const transport = createAvalancheTransportClient(
        {
          type: "http",
        },
        avalanche,
        { apiKey: "test-api-key" }
      );
      expect((transport as any).type).toBe("http");
      expect((transport as any).config?.fetchOptions?.headers).toMatchObject({
        "x-glacier-api-key": "test-api-key",
        "User-Agent": `@avalanche-sdk/client ${SDK_METADATA.version}`,
        "Content-Type": "application/json",
      });
      expect((transport as any).url).toBe(
        "https://api.avax.network/ext/bc/C/rpc"
      );
    });

    test("creates HTTP transport with rlToken", () => {
      const transport = createAvalancheTransportClient(
        {
          type: "http",
          url: "https://api.avax.network",
        },
        undefined,
        { rlToken: "test-rl-token" }
      );

      expect((transport as any).type).toBe("http");
      expect((transport as any).config?.fetchOptions?.headers).toMatchObject({
        rlToken: "test-rl-token",
        "User-Agent": `@avalanche-sdk/client ${SDK_METADATA.version}`,
        "Content-Type": "application/json",
      });
      expect((transport as any).url).toBe("https://api.avax.network");
    });

    test("creates HTTP transport with custom config", () => {
      const transport = createAvalancheTransportClient(
        {
          type: "http",
          url: "https://api.avax.network",
          config: {
            fetchOptions: {
              headers: {
                "Custom-Header": "custom-value",
              },
            },
          },
        },
        avalanche
      );

      expect((transport as any).type).toBe("http");
      expect((transport as any).config?.fetchOptions?.headers).toMatchObject({
        "Custom-Header": "custom-value",
      });
    });

    test("merges custom headers with common headers", () => {
      const transport = createAvalancheTransportClient(
        {
          type: "http",
          url: "https://api.avax.network",
          config: {
            fetchOptions: {
              headers: {
                "Custom-Header": "custom-value",
              },
            },
          },
        },
        avalanche,
        { apiKey: "test-api-key" }
      );

      expect((transport as any).config?.fetchOptions?.headers).toMatchObject({
        "x-glacier-api-key": "test-api-key",
        "Custom-Header": "custom-value",
        "User-Agent": `@avalanche-sdk/client ${SDK_METADATA.version}`,
        "Content-Type": "application/json",
      });
    });
  });

  describe("WebSocket transport", () => {
    test("creates WebSocket transport with URL", () => {
      const transport = createAvalancheTransportClient({
        type: "ws",
        url: "wss://api.avax.network",
      });
      expect((transport as any).type).toBe("ws");
      expect((transport as any).url).toBe("wss://api.avax.network");
    });

    test("throws error when creating WebSocket transport with chain and no URL when chain config does not have a default WebSocket URL", () => {
      expect(() => {
        createAvalancheTransportClient(
          {
            type: "ws",
          },
          avalanche
        );
      }).toThrow("URL is required");
    });

    test("creates WebSocket transport with config", () => {
      const transport = createAvalancheTransportClient({
        type: "ws",
        url: "wss://api.avax.network",
        config: {
          reconnect: true,
        },
      });

      expect((transport as any).type).toBe("ws");
      expect((transport as any).config).toMatchObject({
        reconnect: true,
      });
    });
  });

  describe("Custom transport", () => {
    test("creates custom transport for wallet client type", () => {
      const mockProvider = {
        request: vi.fn(),
      };

      const transport = createAvalancheTransportClient(
        {
          type: "custom",
          provider: mockProvider,
        },
        undefined,
        {},
        "wallet"
      );

      expect((transport as any).type).toBe("custom");
      expect((transport as any).provider).toBe(mockProvider);
    });

    test("converts custom transport to HTTP for non-wallet client types", () => {
      const mockProvider = {
        request: vi.fn(),
      };

      const transport = createAvalancheTransportClient(
        {
          type: "custom",
          provider: mockProvider,
        },
        avalanche,
        {},
        "pChain"
      );

      expect((transport as any).type).toBe("http");
      expect((transport as any).url).toBe("https://api.avax.network/ext/bc/P");
    });

    test("converts custom transport to HTTP with API key", () => {
      const mockProvider = {
        request: vi.fn(),
      };

      const transport = createAvalancheTransportClient(
        {
          type: "custom",
          provider: mockProvider,
        },
        avalanche,
        { apiKey: "test-api-key" },
        "xChain"
      );

      expect((transport as any).type).toBe("http");
      expect((transport as any).url).toBe("https://api.avax.network/ext/bc/X");
      expect((transport as any).config?.fetchOptions?.headers).toMatchObject({
        "x-glacier-api-key": "test-api-key",
      });
    });

    test("converts custom transport to HTTP with rlToken", () => {
      const mockProvider = {
        request: vi.fn(),
      };

      const transport = createAvalancheTransportClient(
        {
          type: "custom",
          provider: mockProvider,
        },
        avalanche,
        { rlToken: "test-rl-token" },
        "cChain"
      );

      expect((transport as any).type).toBe("http");
      expect((transport as any).url).toBe(
        "https://api.avax.network/ext/bc/C/avax"
      );
      expect((transport as any).config?.fetchOptions?.headers).toMatchObject({
        rlToken: "test-rl-token",
      });
    });

    test("converts custom transport to HTTP with common headers when no auth", () => {
      const mockProvider = {
        request: vi.fn(),
      };

      const transport = createAvalancheTransportClient(
        {
          type: "custom",
          provider: mockProvider,
        },
        avalanche,
        {},
        "info"
      );

      expect((transport as any).type).toBe("http");
      expect((transport as any).url).toBe("https://api.avax.network/ext/info");
      expect((transport as any).config?.fetchOptions?.headers).toMatchObject({
        "User-Agent": `@avalanche-sdk/client ${SDK_METADATA.version}`,
        "Content-Type": "application/json",
      });
    });
  });

  describe("IPC transport", () => {
    test("throws error for IPC transport", () => {
      expect(() => {
        createAvalancheTransportClient({
          type: "ipc",
          path: "/tmp/ipc.sock",
        } as any);
      }).toThrow(
        "IPC transport is not available in browser environments. Use HTTP or WebSocket transport instead."
      );
    });
  });

  describe("Fallback transport", () => {
    test("creates fallback transport", () => {
      const mockTransport1 = { type: "http", url: "https://api1.example.com" };
      const mockTransport2 = { type: "http", url: "https://api2.example.com" };

      const transport = createAvalancheTransportClient({
        type: "fallback",
        transports: [mockTransport1, mockTransport2] as any,
      });

      expect((transport as any).type).toBe("fallback");
      expect((transport as any).transports).toEqual([
        mockTransport1,
        mockTransport2,
      ]);
    });

    test("creates fallback transport with config", () => {
      const mockTransport1 = { type: "http", url: "https://api1.example.com" };

      const transport = createAvalancheTransportClient({
        type: "fallback",
        transports: [mockTransport1] as any,
        config: {
          retryCount: 3,
        },
      });

      expect((transport as any).type).toBe("fallback");
      expect((transport as any).config).toMatchObject({
        retryCount: 3,
      });
    });
  });

  describe("Invalid transport type", () => {
    test("throws error for invalid transport type", () => {
      expect(() => {
        createAvalancheTransportClient({
          type: "invalid" as any,
        });
      }).toThrow("Invalid transport type");
    });
  });

  describe("getClientURL - different client types", () => {
    const baseURL = "https://api.avax.network";
    const testCases: Array<{
      clientType: ClientType;
      expectedPath: string;
    }> = [
      { clientType: "public", expectedPath: `${baseURL}/ext/bc/C/rpc` },
      { clientType: "wallet", expectedPath: `${baseURL}/ext/bc/C/rpc` },
      { clientType: "pChain", expectedPath: `${baseURL}/ext/bc/P` },
      { clientType: "xChain", expectedPath: `${baseURL}/ext/bc/X` },
      { clientType: "cChain", expectedPath: `${baseURL}/ext/bc/C/avax` },
      { clientType: "admin", expectedPath: `${baseURL}/ext/admin` },
      { clientType: "info", expectedPath: `${baseURL}/ext/info` },
      { clientType: "health", expectedPath: `${baseURL}/ext/health` },
      {
        clientType: "indexPChainBlock",
        expectedPath: `${baseURL}/ext/index/P/block`,
      },
      {
        clientType: "indexCChainBlock",
        expectedPath: `${baseURL}/ext/index/C/block`,
      },
      {
        clientType: "indexXChainBlock",
        expectedPath: `${baseURL}/ext/index/X/block`,
      },
      {
        clientType: "indexXChainTx",
        expectedPath: `${baseURL}/ext/index/X/tx`,
      },
      {
        clientType: "proposervmCChain",
        expectedPath: `${baseURL}/ext/bc/C/proposervm`,
      },
      {
        clientType: "proposervmPChain",
        expectedPath: `${baseURL}/ext/bc/P/proposervm`,
      },
      {
        clientType: "proposervmXChain",
        expectedPath: `${baseURL}/ext/bc/X/proposervm`,
      },
    ];

    testCases.forEach(({ clientType, expectedPath }) => {
      test(`generates correct URL for ${clientType} client type`, () => {
        const transport = createAvalancheTransportClient(
          {
            type: "http",
          },
          avalanche,
          {},
          clientType
        );
        expect((transport as any).url).toBe(expectedPath);
      });
    });
  });

  describe("getClientURL - chain handling", () => {
    test("uses provided URL when chain is not Avalanche mainnet/fuji", () => {
      const customChain = {
        id: 1,
        name: "Custom Chain",
        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        rpcUrls: {
          default: {
            http: ["https://custom-rpc.example.com"],
          },
        },
      } as Chain;

      const transport = createAvalancheTransportClient(
        {
          type: "http",
          url: "https://custom-url.example.com",
        },
        customChain
      );

      expect((transport as any).url).toBe("https://custom-url.example.com");
    });

    test("uses chain RPC URL when no URL provided and chain is not Avalanche", () => {
      const customChain = {
        id: 1,
        name: "Custom Chain",
        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        rpcUrls: {
          default: {
            http: ["https://custom-rpc.example.com"],
          },
        },
      } as Chain;

      const transport = createAvalancheTransportClient(
        {
          type: "http",
        },
        customChain
      );

      expect((transport as any).url).toBe("https://custom-rpc.example.com");
    });

    test("throws error when no URL and no chain RPC URL for Avalanche chains", () => {
      const avalancheChainWithoutRPC = {
        id: 43114,
        name: "Avalanche",
        nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
        rpcUrls: {
          default: {},
        },
      } as Chain;

      expect(() => {
        createAvalancheTransportClient(
          {
            type: "http",
          },
          avalancheChainWithoutRPC
        );
      }).toThrow("URL is required");
    });

    test("handles Avalanche mainnet chain ID (43114)", () => {
      const transport = createAvalancheTransportClient(
        {
          type: "http",
          url: "https://api.avax.network",
        },
        avalanche,
        {},
        "pChain"
      );

      expect((transport as any).url).toBe("https://api.avax.network/ext/bc/P");
    });

    test("handles Fuji testnet chain ID (43113)", () => {
      const fujiChain = {
        id: 43113,
        name: "Avalanche Fuji",
        nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
        rpcUrls: {
          default: {
            http: ["https://api.avax-test.network/ext/bc/C/rpc"],
          },
        },
      } as Chain;

      const transport = createAvalancheTransportClient(
        {
          type: "http",
          url: "https://api.avax-test.network",
        },
        fujiChain,
        {},
        "xChain"
      );

      expect((transport as any).url).toBe(
        "https://api.avax-test.network/ext/bc/X"
      );
    });
  });

  describe("getClientURL - WebSocket transport type", () => {
    test("uses WebSocket URL from chain when available", () => {
      const chainWithWS = {
        id: 1,
        name: "Custom Chain",
        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        rpcUrls: {
          default: {
            http: ["https://custom-rpc.example.com"],
            webSocket: ["wss://custom-ws.example.com"],
          },
        },
      } as Chain;

      const transport = createAvalancheTransportClient(
        {
          type: "ws",
        },
        chainWithWS
      );

      expect((transport as any).url).toBe("wss://custom-ws.example.com");
    });

    test("uses WebSocket URL from Avalanche chain when available", () => {
      const avalancheChainWithWS = {
        id: 43114,
        name: "Avalanche",
        nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
        rpcUrls: {
          default: {
            http: ["https://api.avax.network/ext/bc/C/rpc"],
            webSocket: ["wss://api.avax.network/ext/bc/C/ws"],
          },
        },
      } as Chain;

      const transport = createAvalancheTransportClient(
        {
          type: "ws",
        },
        avalancheChainWithWS,
        {},
        "pChain"
      );

      // When using WebSocket transport, the origin is extracted from the WebSocket URL
      // so the result uses wss:// protocol
      expect((transport as any).url).toBe("wss://api.avax.network/ext/bc/P");
    });

    test("uses provided WebSocket URL for Avalanche chain", () => {
      const transport = createAvalancheTransportClient(
        {
          type: "ws",
          url: "wss://api.avax.network",
        },
        avalanche,
        {},
        "xChain"
      );

      expect((transport as any).url).toBe("wss://api.avax.network/ext/bc/X");
    });
  });

  describe("getClientURL - invalid client type", () => {
    test("throws error for invalid client type", () => {
      expect(() => {
        createAvalancheTransportClient(
          {
            type: "http",
            url: "https://api.avax.network",
          },
          avalanche,
          {},
          "invalidClientType" as ClientType
        );
      }).toThrow(/Invalid client type/);
    });
  });

  describe("Edge cases", () => {
    test("handles undefined chain", () => {
      const transport = createAvalancheTransportClient(
        {
          type: "http",
          url: "https://api.avax.network",
        },
        undefined,
        {},
        "public"
      );

      expect((transport as any).url).toBe("https://api.avax.network");
    });

    test("handles empty config object", () => {
      const transport = createAvalancheTransportClient({
        type: "http",
        url: "https://api.avax.network",
        config: {},
      });

      expect((transport as any).type).toBe("http");
      expect((transport as any).config).toBeDefined();
    });

    test("prioritizes API key over rlToken when both provided", () => {
      const transport = createAvalancheTransportClient(
        {
          type: "http",
          url: "https://api.avax.network",
        },
        undefined,
        { apiKey: "test-api-key", rlToken: "test-rl-token" }
      );

      expect((transport as any).config?.fetchOptions?.headers).toMatchObject({
        "x-glacier-api-key": "test-api-key",
      });
      expect(
        (transport as any).config?.fetchOptions?.headers
      ).not.toHaveProperty("rlToken");
    });

    test("handles Avalanche chain with URL provided and uses chain RPC URL when URL not provided", () => {
      const avalancheChainWithRPC = {
        id: 43114,
        name: "Avalanche",
        nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
        rpcUrls: {
          default: {
            http: ["https://api.avax.network/ext/bc/C/rpc"],
          },
        },
      } as Chain;

      const transport = createAvalancheTransportClient(
        {
          type: "http",
        },
        avalancheChainWithRPC,
        {},
        "cChain"
      );

      expect((transport as any).url).toBe(
        "https://api.avax.network/ext/bc/C/avax"
      );
    });

    test("handles HTTP transport with neither apiKey nor rlToken", () => {
      const transport = createAvalancheTransportClient(
        {
          type: "http",
          url: "https://api.avax.network",
        },
        undefined,
        {}
      );

      expect((transport as any).config?.fetchOptions?.headers).toBeUndefined();
    });

    test("handles custom transport with config for wallet client type", () => {
      const mockProvider = {
        request: vi.fn(),
      };

      const transport = createAvalancheTransportClient(
        {
          type: "custom",
          provider: mockProvider,
          config: {
            retryCount: 5,
          },
        },
        undefined,
        {},
        "wallet"
      );

      expect((transport as any).type).toBe("custom");
      expect((transport as any).provider).toBe(mockProvider);
      expect((transport as any).config).toMatchObject({
        retryCount: 5,
      });
    });
  });
});
