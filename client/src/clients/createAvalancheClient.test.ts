import type { EIP1193RequestFn } from "viem";
import { assertType, describe, expect, test, vi } from "vitest";
import { avalanche, avalancheFuji } from "../chains/index.js";
import type { AvalanchePublicRpcSchema } from "../methods/public/avalanchePublicRpcSchema.js";
import { createAvalancheClient } from "./createAvalancheClient.js";
import type { AvalancheClient } from "./types/createAvalancheClient.js";

const mockTransport = () => ({
  type: "custom" as const,
  provider: {
    request: vi.fn(async () => null) as any,
  },
});

describe("createAvalancheClient", () => {
  test("creates client with default parameters", () => {
    const { uid, ...client } = createAvalancheClient({
      chain: avalanche,
      transport: mockTransport(),
    });

    assertType<EIP1193RequestFn<AvalanchePublicRpcSchema>>(client.request);

    expect(uid).toBeDefined();
    expect(client.key).toBe("avalanche");
    expect(client.name).toBe("Avalanche Client");
  });

  test("creates client with custom key and name", () => {
    const { uid, ...client } = createAvalancheClient({
      chain: avalanche,
      transport: mockTransport(),
      key: "custom-avalanche",
      name: "Custom Avalanche Client",
    });

    expect(uid).toBeDefined();
    expect(client.key).toBe("custom-avalanche");
    expect(client.name).toBe("Custom Avalanche Client");
  });

  test("creates client with chain configuration", () => {
    const { uid, ...client } = createAvalancheClient({
      chain: avalanche,
      transport: mockTransport(),
    });

    expect(uid).toBeDefined();
    expect(client.chain?.id).toBe(43114);
    expect(client.chain?.name).toBe("Avalanche");
  });

  test("creates client with Avalanche mainnet (43114) - includes all sub-clients", () => {
    const client = createAvalancheClient({
      chain: avalanche,
      transport: mockTransport(),
    });

    // Verify all sub-clients are present
    expect(client).toHaveProperty("pChain");
    expect(client).toHaveProperty("cChain");
    expect(client).toHaveProperty("xChain");
    expect(client).toHaveProperty("admin");
    expect(client).toHaveProperty("info");
    expect(client).toHaveProperty("health");
    expect(client).toHaveProperty("proposervm");
    expect(client).toHaveProperty("indexBlock");
    expect(client).toHaveProperty("indexTx");

    // Verify proposervm sub-clients
    expect(client.proposervm).toHaveProperty("cChain");
    expect(client.proposervm).toHaveProperty("pChain");
    expect(client.proposervm).toHaveProperty("xChain");

    // Verify indexBlock sub-clients
    expect(client.indexBlock).toHaveProperty("pChain");
    expect(client.indexBlock).toHaveProperty("cChain");
    expect(client.indexBlock).toHaveProperty("xChain");

    // Verify indexTx sub-clients
    expect(client.indexTx).toHaveProperty("xChain");
  });

  test("creates client with Avalanche Fuji (43113) - includes all sub-clients", () => {
    const client = createAvalancheClient({
      chain: avalancheFuji,
      transport: mockTransport(),
    });

    // Verify all sub-clients are present
    expect(client).toHaveProperty("pChain");
    expect(client).toHaveProperty("cChain");
    expect(client).toHaveProperty("xChain");
    expect(client).toHaveProperty("admin");
    expect(client).toHaveProperty("info");
    expect(client).toHaveProperty("health");
    expect(client).toHaveProperty("proposervm");
    expect(client).toHaveProperty("indexBlock");
    expect(client).toHaveProperty("indexTx");
  });

  test("creates client with non-Avalanche chain - excludes sub-clients", () => {
    const customChain = {
      ...avalanche,
      id: 1, // Ethereum mainnet ID
    } as any;

    const client = createAvalancheClient({
      chain: customChain,
      transport: mockTransport(),
    });

    // Verify sub-clients are NOT present
    expect(client).not.toHaveProperty("pChain");
    expect(client).not.toHaveProperty("cChain");
    expect(client).not.toHaveProperty("xChain");
    expect(client).not.toHaveProperty("admin");
    expect(client).not.toHaveProperty("info");
    expect(client).not.toHaveProperty("health");
    expect(client).not.toHaveProperty("proposervm");
    expect(client).not.toHaveProperty("indexBlock");
    expect(client).not.toHaveProperty("indexTx");
  });

  test("creates client with undefined chain - excludes sub-clients", () => {
    const client = createAvalancheClient({
      transport: {
        type: "http",
        url: "https://api.avax.network/ext/bc/C/rpc",
      },
    });

    // Verify sub-clients are NOT present
    expect(client).not.toHaveProperty("pChain");
    expect(client).not.toHaveProperty("cChain");
    expect(client).not.toHaveProperty("xChain");
    expect(client).not.toHaveProperty("admin");
    expect(client).not.toHaveProperty("info");
    expect(client).not.toHaveProperty("health");
    expect(client).not.toHaveProperty("proposervm");
    expect(client).not.toHaveProperty("indexBlock");
    expect(client).not.toHaveProperty("indexTx");
  });

  describe("sub-clients configuration", () => {
    test("pChain client has correct configuration", () => {
      const client = createAvalancheClient({
        chain: avalanche,
        transport: mockTransport(),
      });

      expect(client.pChain.key).toBe("pChain");
      expect(client.pChain.name).toBe("P-Chain Client");
      expect(client.pChain.chain?.id).toBe(43114);
    });

    test("cChain client has correct configuration", () => {
      const client = createAvalancheClient({
        chain: avalanche,
        transport: mockTransport(),
      });

      expect(client.cChain.key).toBe("cChain");
      expect(client.cChain.name).toBe("C-Chain Client");
      expect(client.cChain.chain?.id).toBe(43114);
    });

    test("xChain client has correct configuration", () => {
      const client = createAvalancheClient({
        chain: avalanche,
        transport: mockTransport(),
      });

      expect(client.xChain.key).toBe("xChain");
      expect(client.xChain.name).toBe("X-Chain Client");
      expect(client.xChain.chain?.id).toBe(43114);
    });

    test("admin client has correct configuration", () => {
      const client = createAvalancheClient({
        chain: avalanche,
        transport: mockTransport(),
      });

      expect(client.admin.key).toBe("admin");
      expect(client.admin.name).toBe("Admin Client");
      expect(client.admin.chain?.id).toBe(43114);
    });

    test("info client has correct configuration", () => {
      const client = createAvalancheClient({
        chain: avalanche,
        transport: mockTransport(),
      });

      expect(client.info.key).toBe("info");
      expect(client.info.name).toBe("Info Client");
      expect(client.info.chain?.id).toBe(43114);
    });

    test("health client has correct configuration", () => {
      const client = createAvalancheClient({
        chain: avalanche,
        transport: mockTransport(),
      });

      expect(client.health.key).toBe("health");
      expect(client.health.name).toBe("Health Client");
      expect(client.health.chain?.id).toBe(43114);
    });

    test("proposervm clients have correct configuration", () => {
      const client = createAvalancheClient({
        chain: avalanche,
        transport: mockTransport(),
      });

      expect(client.proposervm.cChain.key).toBe("proposervm");
      expect(client.proposervm.cChain.name).toBe("proposervm Client");
      expect(client.proposervm.pChain.key).toBe("proposervm");
      expect(client.proposervm.pChain.name).toBe("proposervm Client");
      expect(client.proposervm.xChain.key).toBe("proposervm");
      expect(client.proposervm.xChain.name).toBe("proposervm Client");
    });

    test("indexBlock clients have correct configuration", () => {
      const client = createAvalancheClient({
        chain: avalanche,
        transport: mockTransport(),
      });

      expect(client.indexBlock.pChain.key).toBe("indexPChainBlock");
      expect(client.indexBlock.pChain.name).toBe("Index P-Chain Block Client");
      expect(client.indexBlock.cChain.key).toBe("indexCChainBlock");
      expect(client.indexBlock.cChain.name).toBe("Index C-Chain Block Client");
      expect(client.indexBlock.xChain.key).toBe("indexXChainBlock");
      expect(client.indexBlock.xChain.name).toBe("Index X-Chain Block Client");
    });

    test("indexTx client has correct configuration", () => {
      const client = createAvalancheClient({
        chain: avalanche,
        transport: mockTransport(),
      });

      expect(client.indexTx.xChain.key).toBe("indexXChainTx");
      expect(client.indexTx.xChain.name).toBe("Index X-Chain Tx Client");
    });
  });

  describe("transports", () => {
    test("http transport", () => {
      const { uid, ...client } = createAvalancheClient({
        chain: avalanche,
        transport: {
          type: "http",
        },
      });

      expect(uid).toBeDefined();
      expect(client.transport.type).toBe("http");
    });

    test("custom transport (converted to http)", () => {
      const { uid, ...client } = createAvalancheClient({
        chain: avalanche,
        transport: mockTransport(),
      });

      expect(uid).toBeDefined();
      // Custom transport is converted to HTTP for non-wallet clients
      expect(client.transport.type).toBe("http");
    });
  });

  test("client has extend functionality", () => {
    const client = createAvalancheClient({
      chain: avalanche,
      transport: mockTransport(),
    });

    expect(client).toHaveProperty("extend");
    expect(typeof client.extend).toBe("function");

    const extended = client.extend(() => ({}));
    expect(extended).toHaveProperty("extend");
  });

  test("client has Avalanche public actions", () => {
    const client = createAvalancheClient({
      chain: avalanche,
      transport: mockTransport(),
    });

    // Verify public actions are available
    expect(client).toHaveProperty("baseFee");
    expect(typeof client.baseFee).toBe("function");
    expect(client).toHaveProperty("getChainConfig");
    expect(typeof client.getChainConfig).toBe("function");
    expect(client).toHaveProperty("maxPriorityFeePerGas");
    expect(typeof client.maxPriorityFeePerGas).toBe("function");
    expect(client).toHaveProperty("feeConfig");
    expect(typeof client.feeConfig).toBe("function");
    expect(client).toHaveProperty("getActiveRulesAt");
    expect(typeof client.getActiveRulesAt).toBe("function");
  });

  describe("apiKey and rlToken", () => {
    test("creates client with apiKey", () => {
      const client = createAvalancheClient({
        chain: avalanche,
        transport: mockTransport(),
        apiKey: "test-api-key",
      });

      expect(client).toBeDefined();
      // The apiKey is used in transport creation, verify client is created successfully
      expect(client.key).toBe("avalanche");
    });

    test("creates client with rlToken", () => {
      const client = createAvalancheClient({
        chain: avalanche,
        transport: mockTransport(),
        rlToken: "test-rl-token",
      });

      expect(client).toBeDefined();
      expect(client.key).toBe("avalanche");
    });

    test("creates client with both apiKey and rlToken", () => {
      const client = createAvalancheClient({
        chain: avalanche,
        transport: mockTransport(),
        apiKey: "test-api-key",
        rlToken: "test-rl-token",
      });

      expect(client).toBeDefined();
      expect(client.key).toBe("avalanche");
    });
  });

  describe("type tests", () => {
    test("AvalancheClient type", () => {
      const client = createAvalancheClient({
        chain: avalanche,
        transport: mockTransport(),
      });

      assertType<AvalancheClient>(client);
    });

    test("client with Avalanche chain has sub-clients", () => {
      const client = createAvalancheClient({
        chain: avalanche,
        transport: mockTransport(),
      });

      // TypeScript should know these exist
      assertType<typeof client.pChain>(client.pChain);
      assertType<typeof client.cChain>(client.cChain);
      assertType<typeof client.xChain>(client.xChain);
      assertType<typeof client.admin>(client.admin);
      assertType<typeof client.info>(client.info);
      assertType<typeof client.health>(client.health);
      assertType<typeof client.proposervm>(client.proposervm);
      assertType<typeof client.indexBlock>(client.indexBlock);
      assertType<typeof client.indexTx>(client.indexTx);
    });
  });

  test("client snapshot for Avalanche mainnet", () => {
    const { uid, ...client } = createAvalancheClient({
      chain: avalanche,
      transport: mockTransport(),
    });

    expect(uid).toBeDefined();
    // Verify basic structure
    expect(client).toHaveProperty("key", "avalanche");
    expect(client).toHaveProperty("name", "Avalanche Client");
    expect(client).toHaveProperty("chain");
    expect(client).toHaveProperty("transport");
    expect(client).toHaveProperty("request");
    expect(client).toHaveProperty("extend");
  });

  test("client snapshot for Avalanche Fuji", () => {
    const { uid, ...client } = createAvalancheClient({
      chain: avalancheFuji,
      transport: mockTransport(),
    });

    expect(uid).toBeDefined();
    expect(client).toHaveProperty("key", "avalanche");
    expect(client).toHaveProperty("name", "Avalanche Client");
    expect(client.chain?.id).toBe(43113);
  });
});
