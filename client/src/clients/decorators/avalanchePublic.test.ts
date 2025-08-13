import { createTransport, EIP1193RequestFn } from "viem";
import { describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../createAvalancheBaseClient.js";
import { avalanchePublicActions } from "./avalanchePublic.js";

const mockTransport = () =>
  createTransport({
    key: "mock",
    name: "Mock Transport",
    request: vi.fn(async ({ method }) => {
      switch (method) {
        case "eth_baseFee":
          return "0x3b9aca00";
        case "eth_getChainConfig":
          return {
            chainId: 43114,
            homesteadBlock: 0,
            daoForkBlock: 0,
            daoForkSupport: true,
            eip150Block: 0,
            eip150Hash:
              "0x0000000000000000000000000000000000000000000000000000000000000000",
            eip155Block: 0,
            eip158Block: 0,
            byzantiumBlock: 0,
            constantinopleBlock: 0,
            petersburgBlock: 0,
            istanbulBlock: 0,
            muirGlacierBlock: 0,
            apricotPhase1BlockTimestamp: 1640995200,
            apricotPhase2BlockTimestamp: 1640995200,
            apricotPhase3BlockTimestamp: 1640995200,
            apricotPhase4BlockTimestamp: 1640995200,
            apricotPhase5BlockTimestamp: 1640995200,
          };
        case "eth_maxPriorityFeePerGas":
          return "0x59682f00";
        case "eth_feeConfig":
          return {
            feeConfig: {
              gasLimit: "0x1c9c380",
              targetBlockRate: "0x2",
              minBaseFee: "0x1",
              targetGas: "0x1c9c380",
              baseFeeChangeDenominator: "0x8",
              minBlockGasCost: "0x0",
              maxBlockGasCost: "0x1000000",
              blockGasCostStep: "0x100000",
            },
            lastChangedAt: "0x61e8c8c0",
          };
        case "eth_getActiveRulesAt":
          return {
            ethRules: {
              "EIP-155": true,
              "EIP-158": true,
              "EIP-1559": true,
            },
            avalancheRules: {
              "AVALANCHE-1": true,
              "AVALANCHE-2": true,
            },
            precompiles: {
              "0x0000000000000000000000000000000000000001": {
                name: "ecrecover",
                gas: 3000,
              },
              "0x0000000000000000000000000000000000000002": {
                name: "sha256",
                gas: 60,
              },
            },
          };
        // TODO: add proper responses for the rest of the methods
        // The default case is just a placeholder to satisfy the test
        default:
          return {
            result: {
              someKey: 1,
            },
          };
      }
    }) as unknown as EIP1193RequestFn,
    type: "mock",
  });

const client = createAvalancheBaseClient({
  chain: avalanche,
  transport: mockTransport,
}) as any;

const avalanchePublicClient = avalanchePublicActions(client);

test("default", async () => {
  expect(avalanchePublicClient).toMatchInlineSnapshot(`{
  "baseFee": [Function],
  "feeConfig": [Function],
  "getActiveRulesAt": [Function],
  "getChainConfig": [Function],
  "maxPriorityFeePerGas": [Function],
}`);
});

describe("smoke test", () => {
  test("baseFee", async () => {
    const res = await avalanchePublicClient.baseFee();
    expect(res).toStrictEqual("0x3b9aca00");
  });

  test("getChainConfig", async () => {
    const res = await avalanchePublicClient.getChainConfig();
    expect(res).toStrictEqual({
      chainId: 43114,
      homesteadBlock: 0,
      daoForkBlock: 0,
      daoForkSupport: true,
      eip150Block: 0,
      eip150Hash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      eip155Block: 0,
      eip158Block: 0,
      byzantiumBlock: 0,
      constantinopleBlock: 0,
      petersburgBlock: 0,
      istanbulBlock: 0,
      muirGlacierBlock: 0,
      apricotPhase1BlockTimestamp: 1640995200,
      apricotPhase2BlockTimestamp: 1640995200,
      apricotPhase3BlockTimestamp: 1640995200,
      apricotPhase4BlockTimestamp: 1640995200,
      apricotPhase5BlockTimestamp: 1640995200,
    });
  });

  test("maxPriorityFeePerGas", async () => {
    const res = await avalanchePublicClient.maxPriorityFeePerGas();
    expect(res).toStrictEqual("0x59682f00");
  });

  test("feeConfig", async () => {
    const res = await avalanchePublicClient.feeConfig({
      blk: "0x1",
    });
    expect(res).toStrictEqual({
      feeConfig: {
        gasLimit: "0x1c9c380",
        targetBlockRate: "0x2",
        minBaseFee: "0x1",
        targetGas: "0x1c9c380",
        baseFeeChangeDenominator: "0x8",
        minBlockGasCost: "0x0",
        maxBlockGasCost: "0x1000000",
        blockGasCostStep: "0x100000",
      },
      lastChangedAt: "0x61e8c8c0",
    });
  });

  test("getActiveRulesAt", async () => {
    const res = await avalanchePublicClient.getActiveRulesAt({
      timestamp: "0x61e8c8c0",
    });
    expect(res).toStrictEqual({
      ethRules: {
        "EIP-155": true,
        "EIP-158": true,
        "EIP-1559": true,
      },
      avalancheRules: {
        "AVALANCHE-1": true,
        "AVALANCHE-2": true,
      },
      precompiles: {
        "0x0000000000000000000000000000000000000001": {
          name: "ecrecover",
          gas: 3000,
        },
        "0x0000000000000000000000000000000000000002": {
          name: "sha256",
          gas: 60,
        },
      },
    });
  });
});
