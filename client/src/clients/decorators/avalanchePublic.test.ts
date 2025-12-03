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
        case "eth_blockNumber":
          return "0x1000";
        case "eth_getLogs":
          return [
            {
              eventName: "SendWarpMessage",
              args: {
                sourceAddress: "0xfAcadE0000000000000000000000000000000000",
                unsignedMessageID:
                  "0x9e883c90bee7398d20cf3dd1e96b53a1b8b929833888532e2a2e37f2f6067c39",
                message:
                  "0x00000000000595d7bbe6942f60afd7be8091b89d4e4ed6183862605809c5395dca8dde94b3a3000000d800000000000100000014facade0000010000000000000000000000000000000000b60000000000019fc4f2405328995ed8bf88798e9ff7e310a5bd1918874000000147c9968cefdb8445b2426dd020f12d246defcb11294ab445df7ca4158cf63b66b6c463e9995b380441863f89231d3cd468ecdf7a96b080d3e96e20d74d9f2cd4f96d9dc40000000006931432e0000000100000001fc29235b2bdabea93b3546331fc8dc3a941391b80000000100000001fc29235b2bdabea93b3546331fc8dc3a941391b8000000000000000a",
              },
              address: "0x0200000000000000000000000000000000000005",
              topics: [
                "0x56600c567728a800c0aa927500f831cb451df66a7af570eb4df4dfbf4674887d",
                "0x000000000000000000000000facade0000000000000000000000000000000000",
                "0x9e883c90bee7398d20cf3dd1e96b53a1b8b929833888532e2a2e37f2f6067c39",
              ],
              data: "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000010200000000000595d7bbe6942f60afd7be8091b89d4e4ed6183862605809c5395dca8dde94b3a3000000d800000000000100000014facade0000000000000000000000000000000000000000b60000000000019fc4f2405328995ed8bf8879cf83459efe1402691368e9ff7e310a5bd1918874000000147c9968cefdb8445b2426dd020f12d246defcb11294ab445df7ca4158cf63b66b6c463e9995b380441863f89231d3cd468ecdf7a96b080d3e96e20d74d9f2cd4f96d9dc40000000006931432e0000000100000001fc29235b2bdabea93b3546331fc8dc3a941391b80000000100000001fc29235b2bdabea93b3546331fc8dc3a941391b8000000000000000a000000000000000000000000000000000000000000000000000000000000",
              blockNumber: 6n,
              transactionHash:
                "0xa8935a010bb7bdea63580b8fc366641f801d2e7a86d98b6b5ade3b33bf5ecdce",
              transactionIndex: 0,
              blockHash:
                "0xba44797cac7ba95176f4fc5e1395cea55f8e766782bc9625031117e067641fe6",
              logIndex: 0,
              removed: false,
            },
          ];

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
  "getRegistrationJustification": [Function],
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

  test("getRegistrationJustification", async () => {
    const res = await avalanchePublicClient.getRegistrationJustification({
      validationID:
        "0x5ecf5d9c6fe20c4e43afda8f5cc97e7baef800ed485a60f7370fe26fdea75e3a",
      subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
      maxBootstrapValidators: 100,
      chunkSize: 200,
      maxChunks: 100,
    });
    expect(res.error).toBeUndefined();
    expect(res.justification).not.toBeNull();
  });
});
