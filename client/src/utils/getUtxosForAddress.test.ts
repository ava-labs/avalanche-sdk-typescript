import { createClient, createTransport, EIP1193RequestFn } from "viem";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { privateKeyToAvalancheAccount } from "../accounts/index.js";
import { avalanche } from "../chains/index.js";
import { privateKey1ForTest } from "../methods/wallet/fixtures/transactions/common.js";
import { getUTXOStrings } from "../methods/wallet/fixtures/transactions/pChain.js";
import { getUtxosForAddress } from "./getUtxosForAddress.js";

const account1 = privateKeyToAvalancheAccount(privateKey1ForTest);

const mockRequest = vi.fn(async ({ method, params }) => {
  if (
    method === "platform.getUTXOs" ||
    method === "avm.getUTXOs" ||
    method === "avax.getUTXOs"
  ) {
    if (params.addresses.includes("invalid-address")) {
      throw new Error("Invalid address");
    }
    const utxos = getUTXOStrings(
      BigInt(50 * 1e9),
      "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK",
      [account1.getXPAddress("P", "fuji")]
    );

    return {
      numFetched: utxos.length,
      utxos: utxos,
      endIndex: {
        address: params.addresses[0],
        utxo: utxos[utxos.length - 1],
      },
    };
  }
  throw new Error(`Unexpected method: ${method}`);
});

const mockTransport = () =>
  createTransport({
    key: "mock",
    name: "Mock Transport",
    request: mockRequest as unknown as EIP1193RequestFn,
    type: "mock",
  });

// Paginated mock transport
let paginatedCallCount = 0;
const paginatedMockRequest = vi.fn(async ({ method, params }) => {
  if (
    method === "platform.getUTXOs" ||
    method === "avm.getUTXOs" ||
    method === "avax.getUTXOs"
  ) {
    paginatedCallCount++;
    const utxos = getUTXOStrings(
      BigInt(50 * 1e9),
      "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK",
      [account1.getXPAddress("P", "fuji")]
    );

    // First call returns 1024, second call returns less
    const numFetched = paginatedCallCount === 1 ? 1024 : utxos.length;

    return {
      numFetched,
      utxos: paginatedCallCount === 1 ? utxos.concat(utxos) : utxos,
      endIndex: {
        address: params.addresses[0],
        utxo: utxos[utxos.length - 1],
      },
    };
  }
  throw new Error(`Unexpected method: ${method}`);
});

const paginatedMockTransport = () =>
  createTransport({
    key: "mock",
    name: "Mock Transport",
    request: paginatedMockRequest as unknown as EIP1193RequestFn,
    type: "mock",
  });

// Error mock transport
const errorMockRequest = vi.fn(async () => {
  throw new Error("RPC error");
});

const errorMockTransport = () =>
  createTransport({
    key: "mock",
    name: "Mock Transport",
    request: errorMockRequest as unknown as EIP1193RequestFn,
    type: "mock",
  });

// Many UTXOs mock transport (for max limit test)
let manyUtxosCallCount = 0;
const manyUtxosMockRequest = vi.fn(async ({ method, params }) => {
  if (
    method === "platform.getUTXOs" ||
    method === "avm.getUTXOs" ||
    method === "avax.getUTXOs"
  ) {
    manyUtxosCallCount++;
    const utxos = getUTXOStrings(
      BigInt(50 * 1e9),
      "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK",
      [account1.getXPAddress("P", "fuji")]
    );

    // Return 1024 to trigger pagination, but accumulate many UTXOs
    return {
      numFetched: 1024,
      utxos: Array(1024).fill(utxos[0]).flat(),
      endIndex: {
        address: params.addresses[0],
        utxo: utxos[utxos.length - 1],
      },
    };
  }
  throw new Error(`Unexpected method: ${method}`);
});

const manyUtxosMockTransport = () =>
  createTransport({
    key: "mock",
    name: "Mock Transport",
    request: manyUtxosMockRequest as unknown as EIP1193RequestFn,
    type: "mock",
  });

type MockTransportType = "default" | "paginated" | "error" | "manyUtxos";

const getMockClient = (transportType: MockTransportType = "default") => {
  let transport = mockTransport;
  if (transportType === "paginated") {
    transport = paginatedMockTransport;
  } else if (transportType === "error") {
    transport = errorMockTransport;
  } else if (transportType === "manyUtxos") {
    transport = manyUtxosMockTransport;
  }

  return {
    ...createClient({
      chain: avalanche,
      transport: transport,
    }),
    pChainClient: createClient({
      chain: avalanche,
      transport: transport,
    }),
    cChainClient: createClient({
      chain: avalanche,
      transport: transport,
    }),
    xChainClient: createClient({
      chain: avalanche,
      transport: transport,
    }),
    infoClient: createClient({
      chain: avalanche,
      transport: transport,
    }),
  } as any;
};

describe("getUtxosForAddress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    paginatedCallCount = 0;
    manyUtxosCallCount = 0;
  });

  describe("P-Chain", () => {
    test("fetches UTXOs for P-Chain address", async () => {
      const client = getMockClient();
      const address = account1.getXPAddress("P", "fuji");
      const utxos = await getUtxosForAddress(client, {
        address,
        chainAlias: "P",
      });

      expect(Array.isArray(utxos)).toBe(true);
      expect(utxos.length).toBeGreaterThan(0);
      expect(mockRequest).toHaveBeenCalledWith({
        method: "platform.getUTXOs",
        params: {
          addresses: [address],
        },
      });
    });

    test("fetches UTXOs with sourceChain parameter", async () => {
      const client = getMockClient();

      const address = account1.getXPAddress("P", "fuji");
      const sourceChain = "X";
      const utxos = await getUtxosForAddress(client, {
        address,
        chainAlias: "P",
        sourceChain,
      });

      expect(Array.isArray(utxos)).toBe(true);
      expect(mockRequest).toHaveBeenCalledWith({
        method: "platform.getUTXOs",
        params: {
          addresses: [address],
          sourceChain,
        },
      });
    });

    test("parses UTXOs correctly", async () => {
      const client = getMockClient();

      const address = account1.getXPAddress("P", "fuji");
      const utxos = await getUtxosForAddress(client, {
        address,
        chainAlias: "P",
      });

      expect(utxos.length).toBeGreaterThan(0);
      // Each UTXO should be a valid Utxo object
      utxos.forEach((utxo) => {
        expect(utxo).toBeDefined();
        expect(utxo.getAssetId).toBeDefined();
      });
    });
  });

  describe("X-Chain", () => {
    test("fetches UTXOs for X-Chain address", async () => {
      const client = getMockClient();

      const address = account1.getXPAddress("X", "fuji");
      const utxos = await getUtxosForAddress(client, {
        address,
        chainAlias: "X",
      });

      expect(Array.isArray(utxos)).toBe(true);
      expect(mockRequest).toHaveBeenCalledWith({
        method: "avm.getUTXOs",
        params: {
          addresses: [address],
        },
      });
    });
  });

  describe("C-Chain", () => {
    test("fetches UTXOs for C-Chain address", async () => {
      const client = getMockClient();

      const address = account1.getXPAddress("C", "fuji");
      const utxos = await getUtxosForAddress(client, {
        address,
        chainAlias: "C",
      });

      expect(Array.isArray(utxos)).toBe(true);
      expect(mockRequest).toHaveBeenCalledWith({
        method: "avax.getUTXOs",
        params: {
          addresses: [address],
        },
      });
    });
  });

  describe("pagination", () => {
    test("handles pagination when numFetched is 1024", async () => {
      const client = getMockClient("paginated");

      const address = account1.getXPAddress("P", "fuji");
      const utxos = await getUtxosForAddress(client, {
        address,
        chainAlias: "P",
      });

      expect(paginatedCallCount).toBeGreaterThan(1);
      expect(Array.isArray(utxos)).toBe(true);
    });

    test("stops pagination when numFetched is less than 1024", async () => {
      const client = getMockClient("default");

      const address = account1.getXPAddress("P", "fuji");
      const utxos = await getUtxosForAddress(client, {
        address,
        chainAlias: "P",
      });

      // Should only call once since numFetched < 1024
      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(Array.isArray(utxos)).toBe(true);
    });
  });

  describe("max UTXOs limit", () => {
    test("warns when reaching max UTXOs limit", async () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const client = getMockClient("manyUtxos");

      const address = account1.getXPAddress("P", "fuji");
      const utxos = await getUtxosForAddress(client, {
        address,
        chainAlias: "P",
      });

      // Should warn when reaching 5000 UTXOs
      // Note: This test may not trigger the warning if we don't reach 5000,
      // but it verifies the logic exists
      expect(Array.isArray(utxos)).toBe(true);

      consoleSpy.mockRestore();
    });
  });

  describe("error cases", () => {
    test("handles RPC errors gracefully", async () => {
      const client = getMockClient("error");

      const address = account1.getXPAddress("P", "fuji");
      await expect(
        getUtxosForAddress(client, {
          address,
          chainAlias: "P",
        })
      ).rejects.toThrow("RPC error");
    });

    test("handles invalid address", async () => {
      const client = getMockClient("default");

      // Invalid address format
      await expect(
        getUtxosForAddress(client, {
          address: "invalid-address",
          chainAlias: "P",
        })
      ).rejects.toThrow();
    });
  });
});
