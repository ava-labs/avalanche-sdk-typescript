import { createTransport, EIP1193RequestFn } from "viem";
import { describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../createAvalancheBaseClient.js";
import { avalancheActions } from "./testUtils.js";

const mockTransport = () =>
  createTransport({
    key: "mock",
    name: "Mock Transport",
    request: vi.fn(async ({ method }) => {
      switch (method) {
        // P-Chain methods
        case "platform.getBalance":
          return {
            balance: 1,
            unlocked: 1,
            lockedStakeable: 1,
            lockedNotStakeable: 1,
            utxoIDs: [{ txID: "string", outputIndex: 1 }],
          };
        case "platform.getHeight":
          return { height: 12345 };
        case "platform.getCurrentValidators":
          return { validators: [] };
        case "platform.getMinStake":
          return {
            minValidatorStake: 1,
            minDelegatorStake: 1,
          };
        case "platform.getTxStatus":
          return { status: "Accepted" };
        case "platform.issueTx":
          return {
            txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
          };

        // C-Chain methods
        case "avax.getAtomicTx":
          return {
            tx: "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
            blockHeight: "12345",
            encoding: "hex",
          };
        case "avax.getAtomicTxStatus":
          return {
            status: "Accepted",
            blockHeight: "12345",
          };
        case "avax.getUTXOs":
          return {
            numFetched: 2,
            utxos: [
              "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
            ],
            endIndex: {
              address: "X-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy",
              utxo: "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
            },
          };

        // X-Chain methods
        case "avm.getAllBalances":
          return {
            balances: [
              {
                assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
                balance: 1000000000n,
              },
            ],
          };
        case "avm.getBalance":
          return {
            balance: 1000000000n,
            utxoIDs: [
              {
                txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                outputIndex: 0,
              },
            ],
          };
        case "avm.getHeight":
          return { height: 12345 };
        case "avm.getTxStatus":
          return { status: "Accepted" };
        case "avm.issueTx":
          return {
            txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
          };

        // Admin API methods
        case "admin.getChainAliases":
          return {
            aliases: ["myBlockchainAlias", "anotherAlias"],
          };
        case "admin.getLoggerLevel":
          return {
            loggerLevels: {
              C: {
                logLevel: "INFO",
                displayLevel: "INFO",
              },
            },
          };
        case "admin.loadVMs":
          return {
            newVMs: {
              rWmY6Sh7P9mjQoTfXd89un7WoroFezFXp: ["vm1", "vm2"],
            },
            failedVMs: {
              failedVM1: "Failed to load: missing dependencies",
            },
          };

        // Info API methods
        case "info.getNetworkID":
          return { networkID: "1" };
        case "info.getNetworkName":
          return { networkName: "Mainnet" };
        case "info.getNodeVersion":
          return {
            version: "v1.10.0",
            databaseVersion: "v1.4.5",
            gitCommit: "abcdef1234567890",
            vmVersions: {
              avm: "v1.10.0",
              evm: "v0.12.0",
              platform: "v1.10.0",
            },
          };
        case "info.isBootstrapped":
          return { isBootstrapped: true };

        // Health API methods
        case "health.health":
          return {
            healthy: true,
            checks: {
              C: {
                message: {
                  engine: {
                    consensus: {
                      lastAcceptedHeight: 12345,
                      lastAcceptedID:
                        "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                      longestProcessingBlock:
                        "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                      processingBlocks: 5,
                    },
                    vm: null,
                  },
                  networking: {
                    percentConnected: 95.5,
                  },
                },
                timestamp: "2024-01-01T00:00:00Z",
                duration: 100,
              },
            },
          };
        case "health.liveness":
          return { healthy: true };

        // Index API methods
        case "index.getContainerByID":
          return {
            id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
            bytes:
              "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
            timestamp: "2024-01-01T00:00:00Z",
            encoding: "hex",
            index: "12345",
          };
        case "index.isAccepted":
          return { accepted: true, encoding: "hex" };
        case "index.getContainerByIndex":
          return {
            id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
            bytes: "0x1234567890abcdef",
            timestamp: "2024-01-01T00:00:00Z",
            encoding: "hex",
            index: "0",
          };
        case "index.getContainerRange":
          return {
            containers: [
              {
                id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
                bytes: "0x1234567890abcdef",
                timestamp: "2024-01-01T00:00:00Z",
                encoding: "hex",
                index: "0",
              },
            ],
            encoding: "hex",
          };
        case "index.getIndex":
          return { index: "12345", encoding: "hex" };
        case "index.getLastAccepted":
          return {
            id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
            bytes: "0x1234567890abcdef",
            timestamp: "2024-01-01T00:00:00Z",
            encoding: "hex",
            index: "12345",
          };

        // Proposervm API methods
        case "proposervm.getCurrentEpoch":
          return {
            number: "1",
            startTime: "1678886400",
            pChainHeight: "1000",
          };
        case "proposervm.getProposedHeight":
          return { height: "1000" };

        // Admin API methods
        case "admin.alias":
          return undefined;
        case "admin.aliasChain":
          return undefined;
        case "admin.setLoggerLevel":
          return undefined;

        // Health API methods
        case "health.readiness":
          return { ready: true };

        // Info API methods
        case "info.getBlockchainID":
          return {
            blockchainID: "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
          };
        case "info.getNodeID":
          return {
            nodeID: "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg",
            nodePOP: "P-avax1gss39m5sx6jn7wlyzeqzm086yfq2l02xkvmecy",
          };
        case "info.getNodeIP":
          return { ip: "127.0.0.1:9651" };
        case "info.getTxFee":
          return {
            txFee: "1000000",
            createAssetTxFee: "2000000",
            createSubnetTxFee: "3000000",
            transformSubnetTxFee: "4000000",
            createBlockchainTxFee: "5000000",
            addPrimaryNetworkValidatorFee: "6000000",
            addPrimaryNetworkDelegatorFee: "7000000",
            addSubnetValidatorFee: "8000000",
            addSubnetDelegatorFee: "9000000",
          };
        case "info.getVMs":
          return {
            vms: {
              avm: "v1.10.0",
              evm: "v0.12.0",
              platform: "v1.10.0",
            },
          };

        // X-Chain methods
        case "avm.getTx":
          return {
            tx: "0x1234567890abcdef",
            encoding: "hex",
          };
        case "avm.getBlock":
          return {
            block: "0x1234567890abcdef",
            encoding: "hex",
          };
        case "avm.getBlockByHeight":
          return {
            block: "0x1234567890abcdef",
            encoding: "hex",
          };
        case "avm.getUTXOs":
          return {
            numFetched: 2,
            utxos: [
              "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
            ],
            endIndex: {
              address: "X-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy",
              utxo: "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
            },
          };
        case "avm.getTxFee":
          return {
            txFee: "1000000",
            assetCreateTxFee: "2000000",
          };
        case "avm.getAssetDescription":
          return {
            name: "Avalanche",
            symbol: "AVAX",
            denomination: "9",
          };

        // Avalanche Public methods
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
            },
          };

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

// Create a mock client with all the necessary chain clients
const mockClient = {
  ...createAvalancheBaseClient({
    chain: avalanche,
    transport: mockTransport,
  }),
  pChain: createAvalancheBaseClient({
    chain: avalanche,
    transport: mockTransport,
  }),
  cChain: createAvalancheBaseClient({
    chain: avalanche,
    transport: mockTransport,
  }),
  xChain: createAvalancheBaseClient({
    chain: avalanche,
    transport: mockTransport,
  }),
  admin: createAvalancheBaseClient({
    chain: avalanche,
    transport: mockTransport,
  }),
  info: createAvalancheBaseClient({
    chain: avalanche,
    transport: mockTransport,
  }),
  health: createAvalancheBaseClient({
    chain: avalanche,
    transport: mockTransport,
  }),
  proposervm: {
    cChain: createAvalancheBaseClient({
      chain: avalanche,
      transport: mockTransport,
    }),
    pChain: createAvalancheBaseClient({
      chain: avalanche,
      transport: mockTransport,
    }),
    xChain: createAvalancheBaseClient({
      chain: avalanche,
      transport: mockTransport,
    }),
  } as any,
  indexBlock: {
    pChain: createAvalancheBaseClient({
      chain: avalanche,
      transport: mockTransport,
    }),
    cChain: createAvalancheBaseClient({
      chain: avalanche,
      transport: mockTransport,
    }),
    xChain: createAvalancheBaseClient({
      chain: avalanche,
      transport: mockTransport,
    }),
  },
  indexTx: {
    xChain: createAvalancheBaseClient({
      chain: avalanche,
      transport: mockTransport,
    }),
  },
} as any;

const avalancheClient = avalancheActions(mockClient);

test("default", async () => {
  expect(avalancheClient).toMatchInlineSnapshot(`{
  "admin": {
    "alias": [Function],
    "aliasChain": [Function],
    "getChainAliases": [Function],
    "getLoggerLevel": [Function],
    "loadVMs": [Function],
    "lockProfile": [Function],
    "memoryProfile": [Function],
    "setLoggerLevel": [Function],
    "startCPUProfiler": [Function],
    "stopCPUProfiler": [Function],
  },
  "baseFee": [Function],
  "cChain": {
    "getAtomicTx": [Function],
    "getAtomicTxStatus": [Function],
    "getUTXOs": [Function],
    "issueTx": [Function],
  },
  "call": [Function],
  "createAccessList": [Function],
  "createBlockFilter": [Function],
  "createContractEventFilter": [Function],
  "createEventFilter": [Function],
  "createPendingTransactionFilter": [Function],
  "estimateContractGas": [Function],
  "estimateFeesPerGas": [Function],
  "estimateGas": [Function],
  "estimateMaxPriorityFeePerGas": [Function],
  "feeConfig": [Function],
  "getActiveRulesAt": [Function],
  "getBalance": [Function],
  "getBlobBaseFee": [Function],
  "getBlock": [Function],
  "getBlockNumber": [Function],
  "getBlockTransactionCount": [Function],
  "getBytecode": [Function],
  "getChainConfig": [Function],
  "getChainId": [Function],
  "getCode": [Function],
  "getContractEvents": [Function],
  "getEip712Domain": [Function],
  "getEnsAddress": [Function],
  "getEnsAvatar": [Function],
  "getEnsName": [Function],
  "getEnsResolver": [Function],
  "getEnsText": [Function],
  "getFeeHistory": [Function],
  "getFilterChanges": [Function],
  "getFilterLogs": [Function],
  "getGasPrice": [Function],
  "getLogs": [Function],
  "getProof": [Function],
  "getRegistrationJustification": [Function],
  "getStorageAt": [Function],
  "getTransaction": [Function],
  "getTransactionConfirmations": [Function],
  "getTransactionCount": [Function],
  "getTransactionReceipt": [Function],
  "health": {
    "health": [Function],
    "liveness": [Function],
    "readiness": [Function],
  },
  "indexBlock": {
    "cChain": {
      "getContainerByID": [Function],
      "getContainerByIndex": [Function],
      "getContainerRange": [Function],
      "getIndex": [Function],
      "getLastAccepted": [Function],
      "isAccepted": [Function],
    },
    "pChain": {
      "getContainerByID": [Function],
      "getContainerByIndex": [Function],
      "getContainerRange": [Function],
      "getIndex": [Function],
      "getLastAccepted": [Function],
      "isAccepted": [Function],
    },
    "xChain": {
      "getContainerByID": [Function],
      "getContainerByIndex": [Function],
      "getContainerRange": [Function],
      "getIndex": [Function],
      "getLastAccepted": [Function],
      "isAccepted": [Function],
    },
  },
  "indexTx": {
    "xChain": {
      "getContainerByID": [Function],
      "getContainerByIndex": [Function],
      "getContainerRange": [Function],
      "getIndex": [Function],
      "getLastAccepted": [Function],
      "isAccepted": [Function],
    },
  },
  "info": {
    "acps": [Function],
    "getBlockchainID": [Function],
    "getNetworkID": [Function],
    "getNetworkName": [Function],
    "getNodeID": [Function],
    "getNodeIP": [Function],
    "getNodeVersion": [Function],
    "getTxFee": [Function],
    "getVMs": [Function],
    "isBootstrapped": [Function],
    "peers": [Function],
    "upgrades": [Function],
    "uptime": [Function],
  },
  "maxPriorityFeePerGas": [Function],
  "multicall": [Function],
  "pChain": {
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
    "sampleValidators": [Function],
    "validatedBy": [Function],
    "validates": [Function],
  },
  "prepareTransactionRequest": [Function],
  "proposervm": {
    "cChain": {
      "getCurrentEpoch": [Function],
      "getProposedHeight": [Function],
    },
    "pChain": {
      "getCurrentEpoch": [Function],
      "getProposedHeight": [Function],
    },
    "xChain": {
      "getCurrentEpoch": [Function],
      "getProposedHeight": [Function],
    },
  },
  "readContract": [Function],
  "sendRawTransaction": [Function],
  "sendRawTransactionSync": [Function],
  "simulate": [Function],
  "simulateBlocks": [Function],
  "simulateCalls": [Function],
  "simulateContract": [Function],
  "uninstallFilter": [Function],
  "verifyHash": [Function],
  "verifyMessage": [Function],
  "verifySiweMessage": [Function],
  "verifyTypedData": [Function],
  "waitForTransactionReceipt": [Function],
  "watchBlockNumber": [Function],
  "watchBlocks": [Function],
  "watchContractEvent": [Function],
  "watchEvent": [Function],
  "watchPendingTransactions": [Function],
  "xChain": {
    "buildGenesis": [Function],
    "getAllBalances": [Function],
    "getAssetDescription": [Function],
    "getBalance": [Function],
    "getBlock": [Function],
    "getBlockByHeight": [Function],
    "getHeight": [Function],
    "getTx": [Function],
    "getTxFee": [Function],
    "getTxStatus": [Function],
    "getUTXOs": [Function],
    "issueTx": [Function],
  },
}`);
});

describe("smoke test", () => {
  describe("P-Chain methods", () => {
    test("getBalance", async () => {
      const res = await avalancheClient.pChain!.getBalance({
        addresses: ["P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
      });
      expect(res).toBeDefined();
    });

    test("getHeight", async () => {
      const res = await avalancheClient.pChain!.getHeight();
      expect(res).toBeDefined();
    });

    test("getCurrentValidators", async () => {
      const res = await avalancheClient.pChain!.getCurrentValidators({
        subnetID: "11111111111111111111111111111111LpoYY",
      });
      expect(res).toBeDefined();
    });

    test("getMinStake", async () => {
      const res = await avalancheClient.pChain!.getMinStake({
        subnetID: "11111111111111111111111111111111LpoYY",
      });
      expect(res).toBeDefined();
    });

    test("getTxStatus", async () => {
      const res = await avalancheClient.pChain!.getTxStatus({
        txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
      });
      expect(res).toBeDefined();
    });

    test("issueTx", async () => {
      const res = await avalancheClient.pChain!.issueTx({
        tx: "0x..",
        encoding: "hex",
      });
      expect(res).toBeDefined();
    });
  });

  describe("C-Chain methods", () => {
    test("getAtomicTx", async () => {
      const res = await avalancheClient.cChain!.getAtomicTx({
        txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
      });
      expect(res).toBeDefined();
    });

    test("getAtomicTxStatus", async () => {
      const res = await avalancheClient.cChain!.getAtomicTxStatus({
        txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
      });
      expect(res).toBeDefined();
    });

    test("getUTXOs", async () => {
      const res = await avalancheClient.cChain!.getUTXOs({
        addresses: ["X-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
      });
      expect(res).toBeDefined();
    });

    test("issueTx", async () => {
      const res = await avalancheClient.cChain!.issueTx({
        tx: "0x..",
        encoding: "hex",
      });
      expect(res).toBeDefined();
    });
  });

  describe("X-Chain methods", () => {
    test("getAllBalances", async () => {
      const res = await avalancheClient.xChain!.getAllBalances({
        addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
      });
      expect(res).toBeDefined();
    });

    test("getBalance", async () => {
      const res = await avalancheClient.xChain!.getBalance({
        address: "X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5",
        assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
      });
      expect(res).toBeDefined();
    });

    test("getHeight", async () => {
      const res = await avalancheClient.xChain!.getHeight();
      expect(res).toBeDefined();
    });

    test("getTxStatus", async () => {
      const res = await avalancheClient.xChain!.getTxStatus({
        txID: "11111111111111111111111111111111LpoYY",
      });
      expect(res).toBeDefined();
    });

    test("issueTx", async () => {
      const res = await avalancheClient.xChain!.issueTx({
        tx: "0x..",
        encoding: "hex",
      });
      expect(res).toBeDefined();
    });
  });

  describe("Admin API methods", () => {
    test("getChainAliases", async () => {
      const res = await avalancheClient.admin?.getChainAliases({
        chain: "sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM",
      });
      expect(res).toBeDefined();
    });

    test("getLoggerLevel", async () => {
      const res = await avalancheClient.admin!.getLoggerLevel({
        loggerName: "C",
      });
      expect(res).toBeDefined();
    });

    test("loadVMs", async () => {
      const res = await avalancheClient.admin!.loadVMs();
      expect(res).toBeDefined();
    });
  });

  describe("Info API methods", () => {
    test("getNetworkID", async () => {
      const res = await avalancheClient.info!.getNetworkID();
      expect(res).toBeDefined();
    });

    test("getNetworkName", async () => {
      const res = await avalancheClient.info!.getNetworkName();
      expect(res).toBeDefined();
    });

    test("getNodeVersion", async () => {
      const res = await avalancheClient.info!.getNodeVersion();
      expect(res).toBeDefined();
    });

    test("isBootstrapped", async () => {
      const res = await avalancheClient.info!.isBootstrapped({
        chain: "X",
      });
      expect(res).toBeDefined();
    });
  });

  describe("Health API methods", () => {
    test("health", async () => {
      const res = await avalancheClient.health!.health({
        tags: ["11111111111111111111111111111111LpoYY"],
      });
      expect(res).toBeDefined();
    });

    test("liveness", async () => {
      const res = await avalancheClient.health!.liveness();
      expect(res).toBeDefined();
    });
  });

  describe("Index API methods", () => {
    test("getContainerByID", async () => {
      const res = await avalancheClient.indexBlock!.pChain!.getContainerByID({
        id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
        encoding: "hex",
      });
      expect(res).toBeDefined();
    });

    test("isAccepted", async () => {
      const res = await avalancheClient.indexBlock!.pChain!.isAccepted({
        id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
        encoding: "hex",
      });
      expect(res).toBeDefined();
    });
  });

  describe("proposervm API methods", () => {
    test("getCurrentEpoch C-Chain", async () => {
      const res = await avalancheClient.proposervm!.cChain!.getCurrentEpoch();
      expect(res).toBeDefined();
    });

    test("getProposedHeight C-Chain", async () => {
      const res = await avalancheClient.proposervm!.cChain!.getProposedHeight();
      expect(res).toBeDefined();
    });

    test("getCurrentEpoch P-Chain", async () => {
      const res = await avalancheClient.proposervm!.pChain!.getCurrentEpoch();
      expect(res).toBeDefined();
    });

    test("getProposedHeight X-Chain", async () => {
      const res = await avalancheClient.proposervm!.xChain!.getProposedHeight();
      expect(res).toBeDefined();
    });
  });

  describe("Avalanche Public methods", () => {
    test("baseFee", async () => {
      const res = await avalancheClient.baseFee();
      expect(res).toBeDefined();
    });

    test("getChainConfig", async () => {
      const res = await avalancheClient.getChainConfig();
      expect(res).toBeDefined();
    });

    test("maxPriorityFeePerGas", async () => {
      const res = await avalancheClient.maxPriorityFeePerGas();
      expect(res).toBeDefined();
    });

    test("feeConfig", async () => {
      const res = await avalancheClient.feeConfig({
        blk: "0x1",
      });
      expect(res).toBeDefined();
    });

    test("getActiveRulesAt", async () => {
      const res = await avalancheClient.getActiveRulesAt({
        timestamp: "0x61e8c8c0",
      });
      expect(res).toBeDefined();
    });
  });

  describe("Index API methods", () => {
    test("getContainerByIndex cChain", async () => {
      const res = await avalancheClient.indexBlock!.cChain!.getContainerByIndex(
        {
          index: 0,
          encoding: "hex",
        }
      );
      expect(res).toBeDefined();
    });

    test("getContainerByIndex xChain", async () => {
      const res = await avalancheClient.indexBlock!.xChain!.getContainerByIndex(
        {
          index: 0,
          encoding: "hex",
        }
      );
      expect(res).toBeDefined();
    });

    test("getContainerRange pChain", async () => {
      const res = await avalancheClient.indexBlock!.pChain!.getContainerRange({
        startIndex: 0,
        endIndex: 10,
        encoding: "hex",
      });
      expect(res).toBeDefined();
    });

    test("getIndex cChain", async () => {
      const res = await avalancheClient.indexBlock!.cChain!.getIndex({
        id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
        encoding: "hex",
      });
      expect(res).toBeDefined();
    });

    test("getLastAccepted xChain", async () => {
      const res = await avalancheClient.indexBlock!.xChain!.getLastAccepted({
        encoding: "hex",
      });
      expect(res).toBeDefined();
    });

    test("getContainerByID indexTx xChain", async () => {
      const res = await avalancheClient.indexTx!.xChain!.getContainerByID({
        id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
        encoding: "hex",
      });
      expect(res).toBeDefined();
    });
  });

  describe("proposervm API methods - additional coverage", () => {
    test("getCurrentEpoch P-Chain", async () => {
      const res = await avalancheClient.proposervm!.pChain!.getCurrentEpoch();
      expect(res).toBeDefined();
    });

    test("getProposedHeight P-Chain", async () => {
      const res = await avalancheClient.proposervm!.pChain!.getProposedHeight();
      expect(res).toBeDefined();
    });

    test("getCurrentEpoch X-Chain", async () => {
      const res = await avalancheClient.proposervm!.xChain!.getCurrentEpoch();
      expect(res).toBeDefined();
    });
  });

  describe("Admin API methods - additional coverage", () => {
    test("alias", async () => {
      await avalancheClient.admin!.alias({
        endpoint: "bc/X",
        alias: "myAlias",
      });
      // void method, just verify it doesn't throw
      expect(true).toBe(true);
    });

    test("aliasChain", async () => {
      await avalancheClient.admin!.aliasChain({
        chain: "X",
        alias: "myChainAlias",
      });
      expect(true).toBe(true);
    });

    test("setLoggerLevel", async () => {
      await avalancheClient.admin!.setLoggerLevel({
        loggerName: "C",
        logLevel: "DEBUG",
        displayLevel: "DEBUG",
      });
      expect(true).toBe(true);
    });
  });

  describe("Health API methods - additional coverage", () => {
    test("readiness", async () => {
      const res = await avalancheClient.health!.readiness({
        tags: ["11111111111111111111111111111111LpoYY"],
      });
      expect(res).toBeDefined();
    });
  });

  describe("Info API methods - additional coverage", () => {
    test("getBlockchainID", async () => {
      const res = await avalancheClient.info!.getBlockchainID({
        alias: "X",
      });
      expect(res).toBeDefined();
    });

    test("getNodeID", async () => {
      const res = await avalancheClient.info!.getNodeID();
      expect(res).toBeDefined();
    });

    test("getNodeIP", async () => {
      const res = await avalancheClient.info!.getNodeIP();
      expect(res).toBeDefined();
    });

    test("getTxFee", async () => {
      const res = await avalancheClient.info!.getTxFee();
      expect(res).toBeDefined();
    });

    test("getVMs", async () => {
      const res = await avalancheClient.info!.getVMs();
      expect(res).toBeDefined();
    });
  });

  describe("X-Chain methods - additional coverage", () => {
    test("getTx", async () => {
      const res = await avalancheClient.xChain!.getTx({
        txID: "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
        encoding: "hex",
      });
      expect(res).toBeDefined();
    });

    test("getBlock", async () => {
      const res = await avalancheClient.xChain!.getBlock({
        blockId: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
        encoding: "hex",
      });
      expect(res).toBeDefined();
    });

    test("getBlockByHeight", async () => {
      const res = await avalancheClient.xChain!.getBlockByHeight({
        height: 100,
        encoding: "hex",
      });
      expect(res).toBeDefined();
    });

    test("getUTXOs", async () => {
      const res = await avalancheClient.xChain!.getUTXOs({
        addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
      });
      expect(res).toBeDefined();
    });

    test("getTxFee", async () => {
      const res = await avalancheClient.xChain!.getTxFee();
      expect(res).toBeDefined();
    });

    test("getAssetDescription", async () => {
      const res = await avalancheClient.xChain!.getAssetDescription({
        assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
      });
      expect(res).toBeDefined();
    });
  });
});
