import type { EIP1193RequestFn } from "viem";
import { assertType, describe, expect, test, vi } from "vitest";
import { avalanche } from "../chains/index.js";
import type { PChainRpcSchema } from "../methods/pChain/pChainRpcSchema.js";
import { SDK_METADATA } from "./common.js";
import type { PChainClient } from "./createPChainClient.js";
import { createPChainClient } from "./createPChainClient.js";

const mockTransport = () => ({
  type: "custom" as const,
  provider: {
    request: vi.fn(async () => null) as any,
  },
});

test("creates", () => {
  const { uid, ...client } = createPChainClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  assertType<EIP1193RequestFn<PChainRpcSchema>>(client.request);

  expect(uid).toBeDefined();
  expect(client).toMatchInlineSnapshot(`
    {
      "account": undefined,
      "batch": undefined,
      "cacheTime": 4000,
      "ccipRead": undefined,
      "chain": {
        "blockExplorers": {
          "default": {
            "apiUrl": "https://api.avax.network",
            "name": "Avalanche Explorer",
            "url": "https://subnets.avax.network",
          },
        },
        "contracts": {
          "multicall3": {
            "address": "0xca11bde05977b3631167028862be2a173976ca11",
            "blockCreated": 11907934,
          },
          "teleporterMessenger": {
            "address": "0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf",
          },
          "teleporterRegistry": {
            "address": "0x7C43605E14F391720e1b37E49C78C4b03A488d98",
          },
        },
        "fees": undefined,
        "formatters": undefined,
        "id": 43114,
        "name": "Avalanche",
        "nativeCurrency": {
          "decimals": 18,
          "name": "Avalanche",
          "symbol": "AVAX",
        },
        "rpcUrls": {
          "default": {
            "http": [
              "https://api.avax.network/ext/bc/C/rpc",
            ],
          },
        },
        "serializers": undefined,
      },
      "extend": [Function],
      "getAllValidatorsAt": [Function],
      "getBalance": [Function],
      "getBlock": [Function],
      "getBlockByHeight": [Function],
      "getBlockchainStatus": [Function],
      "getBlockchains": [Function],
      "getCurrentSupply": [Function],
      "getCurrentValidators": [Function],
      "getFeeConfig": [Function],
      "getFeeState": [Function],
      "getHeight": [Function],
      "getL1Validator": [Function],
      "getMinStake": [Function],
      "getProposedHeight": [Function],
      "getRewardUTXOs": [Function],
      "getStake": [Function],
      "getStakingAssetID": [Function],
      "getSubnet": [Function],
      "getSubnets": [Function],
      "getTimestamp": [Function],
      "getTotalStake": [Function],
      "getTx": [Function],
      "getTxStatus": [Function],
      "getUTXOs": [Function],
      "getValidatorsAt": [Function],
      "issueTx": [Function],
      "key": "pChain",
      "name": "P-Chain Client",
      "pollingInterval": 4000,
      "request": [Function],
      "sampleValidators": [Function],
      "transport": {
        "fetchOptions": {
          "headers": {
            "Content-Type": "application/json",
            "User-Agent": "@avalanche-sdk/client ${SDK_METADATA.version}",
          },
        },
        "key": "http",
        "methods": undefined,
        "name": "HTTP JSON-RPC",
        "request": [Function],
        "retryCount": 3,
        "retryDelay": 150,
        "timeout": 10000,
        "type": "http",
        "url": "https://api.avax.network/ext/bc/P",
      },
      "type": "avalancheClient",
      "validatedBy": [Function],
      "validates": [Function],
    }
  `);
});

test("args: key", () => {
  expect(
    createPChainClient({
      chain: avalanche,
      key: "customPChain",
      transport: mockTransport(),
    }).key
  ).toBe("customPChain");
});

test("args: name", () => {
  expect(
    createPChainClient({
      chain: avalanche,
      name: "Custom P-Chain Client",
      transport: mockTransport(),
    }).name
  ).toBe("Custom P-Chain Client");
});

test("args: chain", () => {
  const client = createPChainClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  expect(client.chain).toBe(avalanche);
  expect(client.chain?.id).toBe(43114);
  expect(client.chain?.name).toBe("Avalanche");
});

test("args: chain (undefined)", () => {
  const client = createPChainClient({
    transport: {
      type: "http",
      url: "https://api.avax.network/ext/bc/P",
    },
  });

  expect(client.chain).toBeUndefined();
});

describe("transports", () => {
  test("http", () => {
    const { uid, ...client } = createPChainClient({
      chain: avalanche,
      transport: {
        type: "http",
        url: "https://api.avax.network/ext/bc/P",
      },
    });

    expect(uid).toBeDefined();
    expect(client.transport.type).toBe("http");
    expect(client.key).toBe("pChain");
    expect(client.name).toBe("P-Chain Client");
  });

  test("custom (converted to http for p-chain client)", () => {
    const { uid, ...client } = createPChainClient({
      chain: avalanche,
      transport: mockTransport(),
    });

    expect(uid).toBeDefined();
    // Custom transport is converted to HTTP for non-wallet clients
    expect(client.transport.type).toBe("http");
    expect(client.key).toBe("pChain");
    expect(client.name).toBe("P-Chain Client");
  });
});

test("extend", () => {
  const { uid: _, ...client } = createPChainClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  expect(client).toHaveProperty("extend");
  expect(typeof client.extend).toBe("function");

  // Test that extend returns a client with the same structure
  const extended = client.extend(() => ({}));
  expect(extended).toHaveProperty("getBalance");
  expect(extended).toHaveProperty("extend");
});

test("P-Chain API methods are available", () => {
  const client = createPChainClient({
    chain: avalanche,
    transport: mockTransport(),
  });

  // Verify all P-Chain API methods are present
  expect(client).toHaveProperty("getAllValidatorsAt");
  expect(client).toHaveProperty("getBalance");
  expect(client).toHaveProperty("getBlock");
  expect(client).toHaveProperty("getBlockByHeight");
  expect(client).toHaveProperty("getBlockchainStatus");
  expect(client).toHaveProperty("getBlockchains");
  expect(client).toHaveProperty("getCurrentSupply");
  expect(client).toHaveProperty("getCurrentValidators");
  expect(client).toHaveProperty("getFeeConfig");
  expect(client).toHaveProperty("getFeeState");
  expect(client).toHaveProperty("getHeight");
  expect(client).toHaveProperty("getL1Validator");
  expect(client).toHaveProperty("getMinStake");
  expect(client).toHaveProperty("getProposedHeight");
  expect(client).toHaveProperty("getRewardUTXOs");
  expect(client).toHaveProperty("getStake");
  expect(client).toHaveProperty("getStakingAssetID");
  expect(client).toHaveProperty("getSubnet");
  expect(client).toHaveProperty("getSubnets");
  expect(client).toHaveProperty("getTimestamp");
  expect(client).toHaveProperty("getTotalStake");
  expect(client).toHaveProperty("getTx");
  expect(client).toHaveProperty("getTxStatus");
  expect(client).toHaveProperty("getUTXOs");
  expect(client).toHaveProperty("getValidatorsAt");
  expect(client).toHaveProperty("issueTx");
  expect(client).toHaveProperty("sampleValidators");
  expect(client).toHaveProperty("validatedBy");
  expect(client).toHaveProperty("validates");

  // Verify they are functions
  expect(typeof client.getAllValidatorsAt).toBe("function");
  expect(typeof client.getBalance).toBe("function");
  expect(typeof client.getBlock).toBe("function");
  expect(typeof client.getBlockByHeight).toBe("function");
  expect(typeof client.getBlockchainStatus).toBe("function");
  expect(typeof client.getBlockchains).toBe("function");
  expect(typeof client.getCurrentSupply).toBe("function");
  expect(typeof client.getCurrentValidators).toBe("function");
  expect(typeof client.getFeeConfig).toBe("function");
  expect(typeof client.getFeeState).toBe("function");
  expect(typeof client.getHeight).toBe("function");
  expect(typeof client.getL1Validator).toBe("function");
  expect(typeof client.getMinStake).toBe("function");
  expect(typeof client.getProposedHeight).toBe("function");
  expect(typeof client.getRewardUTXOs).toBe("function");
  expect(typeof client.getStake).toBe("function");
  expect(typeof client.getStakingAssetID).toBe("function");
  expect(typeof client.getSubnet).toBe("function");
  expect(typeof client.getSubnets).toBe("function");
  expect(typeof client.getTimestamp).toBe("function");
  expect(typeof client.getTotalStake).toBe("function");
  expect(typeof client.getTx).toBe("function");
  expect(typeof client.getTxStatus).toBe("function");
  expect(typeof client.getUTXOs).toBe("function");
  expect(typeof client.getValidatorsAt).toBe("function");
  expect(typeof client.issueTx).toBe("function");
  expect(typeof client.sampleValidators).toBe("function");
  expect(typeof client.validatedBy).toBe("function");
  expect(typeof client.validates).toBe("function");
});

describe("type tests", () => {
  test("PChainClient type", () => {
    const client = createPChainClient({
      chain: avalanche,
      transport: mockTransport(),
    });

    assertType<PChainClient>(client);
    assertType<typeof client.getAllValidatorsAt>(client.getAllValidatorsAt);
    assertType<typeof client.getBalance>(client.getBalance);
    assertType<typeof client.getBlock>(client.getBlock);
    assertType<typeof client.getBlockByHeight>(client.getBlockByHeight);
    assertType<typeof client.getBlockchainStatus>(client.getBlockchainStatus);
    assertType<typeof client.getBlockchains>(client.getBlockchains);
    assertType<typeof client.getCurrentSupply>(client.getCurrentSupply);
    assertType<typeof client.getCurrentValidators>(client.getCurrentValidators);
    assertType<typeof client.getFeeConfig>(client.getFeeConfig);
    assertType<typeof client.getFeeState>(client.getFeeState);
    assertType<typeof client.getHeight>(client.getHeight);
    assertType<typeof client.getL1Validator>(client.getL1Validator);
    assertType<typeof client.getMinStake>(client.getMinStake);
    assertType<typeof client.getProposedHeight>(client.getProposedHeight);
    assertType<typeof client.getRewardUTXOs>(client.getRewardUTXOs);
    assertType<typeof client.getStake>(client.getStake);
    assertType<typeof client.getStakingAssetID>(client.getStakingAssetID);
    assertType<typeof client.getSubnet>(client.getSubnet);
    assertType<typeof client.getSubnets>(client.getSubnets);
    assertType<typeof client.getTimestamp>(client.getTimestamp);
    assertType<typeof client.getTotalStake>(client.getTotalStake);
    assertType<typeof client.getTx>(client.getTx);
    assertType<typeof client.getTxStatus>(client.getTxStatus);
    assertType<typeof client.getUTXOs>(client.getUTXOs);
    assertType<typeof client.getValidatorsAt>(client.getValidatorsAt);
    assertType<typeof client.issueTx>(client.issueTx);
    assertType<typeof client.sampleValidators>(client.sampleValidators);
    assertType<typeof client.validatedBy>(client.validatedBy);
    assertType<typeof client.validates>(client.validates);
  });
});
