import { createTransport, EIP1193RequestFn } from "viem";
import { describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../createAvalancheBaseClient.js";
import { infoAPIActions } from "./infoApi.js";

const mockTransport = () =>
  createTransport({
    key: "mock",
    name: "Mock Transport",
    request: vi.fn(async ({ method }) => {
      switch (method) {
        case "info.acps":
          return {
            acps: {
              "1": {
                supportWeight: "100",
                supporters: ["node1", "node2"],
                objectWeight: "50",
                objectors: ["node3", "node4"],
                abstainWeight: "25",
              },
            },
          };
        case "info.getBlockchainID":
          return {
            blockchainID: "11111111111111111111111111111111LpoYY",
          };
        case "info.getNetworkID":
          return {
            networkID: "1",
          };
        case "info.getNetworkName":
          return {
            networkName: "Mainnet",
          };
        case "info.getNodeID":
          return {
            nodeID: "NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5",
            nodePOP: {
              publicKey: "0x1234567890abcdef",
              proofOfPossession: "0xabcdef1234567890",
            },
          };
        case "info.getNodeIP":
          return {
            ip: "192.168.1.100",
          };
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
        case "info.getTxFee":
          return {
            txFee: "1000000",
            creationTxFee: "10000000",
            createSubnetTxFee: "10000000",
            transformSubnetTxFee: "10000000",
            createBlockchainTxFee: "10000000",
            addPrimaryNetworkValidatorFee: "10000000",
            addPrimaryNetworkDelegatorFee: "10000000",
            addSubnetValidatorFee: "10000000",
            createAssetTxFee: "10000000",
            addSubnetDelegatorFee: "10000000",
          };
        case "info.getVMs":
          return {
            vms: {
              avm: {
                "1.10.0": {
                  name: "Avalanche Virtual Machine",
                  description:
                    "Avalanche's native platform for creating and trading assets",
                },
              },
              evm: {
                "0.12.0": {
                  name: "Ethereum Virtual Machine",
                  description: "Ethereum-compatible virtual machine",
                },
              },
              platform: {
                "1.10.0": {
                  name: "Platform Virtual Machine",
                  description: "Platform chain virtual machine",
                },
              },
            },
          };
        case "info.isBootstrapped":
          return {
            isBootstrapped: true,
          };
        case "info.peers":
          return {
            numPeers: 50,
            peers: [
              {
                ip: "192.168.1.101",
                publicIP: "203.0.113.1",
                nodeID: "NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5",
                version: "v1.10.0",
                lastSent: "2024-01-01T00:00:00Z",
                lastReceived: "2024-01-01T00:00:00Z",
                connected: true,
                inbound: false,
                inboundConnection: false,
                outboundConnection: true,
              },
              {
                ip: "192.168.1.102",
                publicIP: "203.0.113.2",
                nodeID: "NodeID-Q8pC3NdkCIgX3OYYXWZkYjW9KEFGpX0EFG",
                version: "v1.10.0",
                lastSent: "2024-01-01T00:00:00Z",
                lastReceived: "2024-01-01T00:00:00Z",
                connected: true,
                inbound: true,
                inboundConnection: true,
                outboundConnection: false,
              },
            ],
          };
        case "info.upgrades":
          return {
            upgrades: {
              "v1.10.0": {
                description: "Avalanche v1.10.0 upgrade",
                timestamp: "2024-01-01T00:00:00Z",
                status: "active",
              },
            },
          };
        case "info.uptime":
          return {
            rewardingStakePercentage: "95.5",
            weightedAveragePercentage: "96.2",
            uptime: "99.8",
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
});

const infoClient = infoAPIActions(client);

test("default", async () => {
  expect(infoClient).toMatchInlineSnapshot(`{
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
}`);
});

describe("smoke test", () => {
  test("acps", async () => {
    const res = await infoClient.acps();
    expect(res).toStrictEqual({
      acps: new Map([
        [
          1,
          {
            supportWeight: 100n,
            supporters: new Set(["node1", "node2"]),
            objectWeight: 50n,
            objectors: new Set(["node3", "node4"]),
            abstainWeight: 25n,
          },
        ],
      ]),
    });
  });

  test("getBlockchainID", async () => {
    const res = await infoClient.getBlockchainID({
      alias: "X",
    });
    expect(res).toStrictEqual({
      blockchainID: "11111111111111111111111111111111LpoYY",
    });
  });

  test("getNetworkID", async () => {
    const res = await infoClient.getNetworkID();
    expect(res).toStrictEqual({
      networkID: "1",
    });
  });

  test("getNetworkName", async () => {
    const res = await infoClient.getNetworkName();
    expect(res).toStrictEqual({
      networkName: "Mainnet",
    });
  });

  test("getNodeID", async () => {
    const res = await infoClient.getNodeID();
    expect(res).toStrictEqual({
      nodeID: "NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5",
      nodePOP: {
        publicKey: "0x1234567890abcdef",
        proofOfPossession: "0xabcdef1234567890",
      },
    });
  });

  test("getNodeIP", async () => {
    const res = await infoClient.getNodeIP();
    expect(res).toStrictEqual({
      ip: "192.168.1.100",
    });
  });

  test("getNodeVersion", async () => {
    const res = await infoClient.getNodeVersion();
    expect(res).toStrictEqual({
      version: "v1.10.0",
      databaseVersion: "v1.4.5",
      gitCommit: "abcdef1234567890",
      vmVersions: {
        avm: "v1.10.0",
        evm: "v0.12.0",
        platform: "v1.10.0",
      },
    });
  });

  test("getTxFee", async () => {
    const res = await infoClient.getTxFee();
    expect(res).toStrictEqual({
      txFee: 1000000n,
      createAssetTxFee: 10000000n,
      createSubnetTxFee: 10000000n,
      transformSubnetTxFee: 10000000n,
      createBlockchainTxFee: 10000000n,
      addPrimaryNetworkValidatorFee: 10000000n,
      addPrimaryNetworkDelegatorFee: 10000000n,
      addSubnetValidatorFee: 10000000n,
      addSubnetDelegatorFee: 10000000n,
    });
  });

  test("getVMs", async () => {
    const res = await infoClient.getVMs();
    expect(res).toStrictEqual({
      vms: {
        avm: {
          "1.10.0": {
            name: "Avalanche Virtual Machine",
            description:
              "Avalanche's native platform for creating and trading assets",
          },
        },
        evm: {
          "0.12.0": {
            name: "Ethereum Virtual Machine",
            description: "Ethereum-compatible virtual machine",
          },
        },
        platform: {
          "1.10.0": {
            name: "Platform Virtual Machine",
            description: "Platform chain virtual machine",
          },
        },
      },
    });
  });

  test("isBootstrapped", async () => {
    const res = await infoClient.isBootstrapped({
      chain: "X",
    });
    expect(res).toStrictEqual({
      isBootstrapped: true,
    });
  });

  test("peers", async () => {
    const res = await infoClient.peers({
      nodeIDs: [],
    });
    expect(res).toStrictEqual({
      numPeers: 50,
      peers: [
        {
          ip: "192.168.1.101",
          publicIP: "203.0.113.1",
          nodeID: "NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5",
          version: "v1.10.0",
          lastSent: "2024-01-01T00:00:00Z",
          lastReceived: "2024-01-01T00:00:00Z",
          connected: true,
          inbound: false,
          inboundConnection: false,
          outboundConnection: true,
        },
        {
          ip: "192.168.1.102",
          publicIP: "203.0.113.2",
          nodeID: "NodeID-Q8pC3NdkCIgX3OYYXWZkYjW9KEFGpX0EFG",
          version: "v1.10.0",
          lastSent: "2024-01-01T00:00:00Z",
          lastReceived: "2024-01-01T00:00:00Z",
          connected: true,
          inbound: true,
          inboundConnection: true,
          outboundConnection: false,
        },
      ],
    });
  });

  test("peers with specific nodeIDs", async () => {
    const res = await infoClient.peers({
      nodeIDs: ["NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5"],
    });
    expect(res).toStrictEqual({
      numPeers: 50,
      peers: [
        {
          ip: "192.168.1.101",
          publicIP: "203.0.113.1",
          nodeID: "NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5",
          version: "v1.10.0",
          lastSent: "2024-01-01T00:00:00Z",
          lastReceived: "2024-01-01T00:00:00Z",
          connected: true,
          inbound: false,
          inboundConnection: false,
          outboundConnection: true,
        },
        {
          ip: "192.168.1.102",
          publicIP: "203.0.113.2",
          nodeID: "NodeID-Q8pC3NdkCIgX3OYYXWZkYjW9KEFGpX0EFG",
          version: "v1.10.0",
          lastSent: "2024-01-01T00:00:00Z",
          lastReceived: "2024-01-01T00:00:00Z",
          connected: true,
          inbound: true,
          inboundConnection: true,
          outboundConnection: false,
        },
      ],
    });
  });

  test("upgrades", async () => {
    const res = await infoClient.upgrades();
    expect(res).toStrictEqual({
      upgrades: {
        "v1.10.0": {
          description: "Avalanche v1.10.0 upgrade",
          timestamp: "2024-01-01T00:00:00Z",
          status: "active",
        },
      },
    });
  });

  test("uptime", async () => {
    const res = await infoClient.uptime();
    expect(res).toStrictEqual({
      rewardingStakePercentage: "95.5",
      weightedAveragePercentage: "96.2",
      uptime: "99.8",
    });
  });
});
