import { createTransport, EIP1193RequestFn } from "viem";
import { describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../createAvalancheBaseClient.js";
import { pChainActions } from "./pChain.js";

const mockTransport = () =>
  createTransport({
    key: "mock",
    name: "Mock Transport",
    request: vi.fn(async ({ method }) => {
      switch (method) {
        case "platform.getBalance":
          return {
            balance: 1,
            unlocked: 1,
            lockedStakeable: 1,
            lockedNotStakeable: 1,
            utxoIDs: [
              {
                txID: "string",
                outputIndex: 1,
              },
            ],
          };
        case "platform.getBlock":
          return {
            encoding: "hex",
            block: "0xa..",
          };
        case "platform.getBlockByHeight":
          return {
            encoding: "hex",
            block: "0xa..",
          };
        case "platform.getBlockchains":
          return {
            blockchains: [
              {
                id: "string",
                name: "string",
                subnetID: "string",
                vmID: "string",
              },
            ],
          };
        case "platform.getCurrentSupply":
          return {
            supply: 1,
          };
        case "platform.getCurrentValidators":
          return {
            validators: [],
          };
        case "platform.getFeeConfig":
          return {
            weights: [1, 1, 1, 1],
            maxCapacity: 1,
            maxPerSecond: 1,
            targetPerSecond: 1,
            minPrice: 1,
            excessConversionConstant: 1,
          };
        case "platform.getFeeState":
          return {
            capacity: 1,
            excess: 1,
            price: 1,
            timestamp: 1,
          };
        case "platform.getMinStake":
          return {
            minValidatorStake: 1,
            minDelegatorStake: 1,
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

const pChainClient = pChainActions(client);

test("default", async () => {
  expect(pChainClient).toMatchInlineSnapshot(`{
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
}`);
});

describe("smoke test", () => {
  test("getBalance", async () => {
    const res = await pChainClient.getBalance({
      addresses: ["P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
    });
    expect(res).toBeDefined();
  });

  test("getBlock", async () => {
    const res = await pChainClient.getBlock({
      blockId: "stFZQ6Ju6KXn6XzHVy9c8RXDvMKLcHV7Uyk5bbzUn1ZDJohzU",
    });
    expect(res).toBeDefined();
  });

  test("getBlockByHeight", async () => {
    const res = await pChainClient.getBlockByHeight({
      height: 1,
    });
    expect(res).toBeDefined();
  });

  test("getBlockchains", async () => {
    const res = await pChainClient.getBlockchains();
    expect(res).toBeDefined();
  });

  test("getCurrentSupply", async () => {
    const res = await pChainClient.getCurrentSupply({});
    expect(res).toBeDefined();
  });

  test("getCurrentValidators", async () => {
    const res = await pChainClient.getCurrentValidators({
      subnetID: "11111111111111111111111111111111LpoYY",
    });
    expect(res).toBeDefined();
  });

  test("getFeeConfig", async () => {
    const res = await pChainClient.getFeeConfig();
    expect(res).toBeDefined();
  });

  test("getFeeState", async () => {
    const res = await pChainClient.getFeeState();
    expect(res).toBeDefined();
  });

  test("getHeight", async () => {
    const res = await pChainClient.getHeight();
    expect(res).toBeDefined();
  });

  test("getMinStake", async () => {
    const res = await pChainClient.getMinStake({
      subnetID: "11111111111111111111111111111111LpoYY",
    });
    expect(res).toBeDefined();
  });

  test("getProposedHeight", async () => {
    const res = await pChainClient.getProposedHeight();
    expect(res).toBeDefined();
  });

  test("getRewardUTXOs", async () => {
    const res = await pChainClient.getRewardUTXOs({
      txID: "fKqWGjHP87VyDPzgbSnFGPh4quSCtwTBJ1hQAd29g2Ncc5n1p",
    });
    expect(res).toBeDefined();
  });

  test("getStake", async () => {
    const res = await pChainClient.getStake({
      addresses: ["P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
    });
    expect(res).toBeDefined();
  });

  test("getStakingAssetID", async () => {
    const res = await pChainClient.getStakingAssetID({
      subnetID: "11111111111111111111111111111111LpoYY",
    });
    expect(res).toBeDefined();
  });

  test("getSubnet", async () => {
    const res = await pChainClient.getSubnet({
      subnetID: "11111111111111111111111111111111LpoYY",
    });
    expect(res).toBeDefined();
  });

  test("getSubnets", async () => {
    const res = await pChainClient.getSubnets({
      ids: ["11111111111111111111111111111111LpoYY"],
    });
    expect(res).toBeDefined();
  });

  test("getTimestamp", async () => {
    const res = await pChainClient.getTimestamp();
    expect(res).toBeDefined();
  });

  test("getTotalStake", async () => {
    const res = await pChainClient.getTotalStake({
      subnetID: "11111111111111111111111111111111LpoYY",
    });
    expect(res).toBeDefined();
  });

  test("getTx", async () => {
    const res = await pChainClient.getTx({
      txID: "fKqWGjHP87VyDPzgbSnFGPh4quSCtwTBJ1hQAd29g2Ncc5n1p",
    });
    expect(res).toBeDefined();
  });

  test("getTxStatus", async () => {
    const res = await pChainClient.getTxStatus({
      txID: "fKqWGjHP87VyDPzgbSnFGPh4quSCtwTBJ1hQAd29g2Ncc5n1p",
    });
    expect(res).toBeDefined();
  });

  test("getUTXOs", async () => {
    const res = await pChainClient.getUTXOs({
      addresses: ["P-avax1tnuesf6cqwnjw7fxjyk7lhch0vhf0v95wj5jvy"],
    });
    expect(res).toBeDefined();
  });

  test("getValidatorsAt", async () => {
    const res = await pChainClient.getValidatorsAt({
      height: 1,
    });
    expect(res).toBeDefined();
  });

  test("sampleValidators", async () => {
    const res = await pChainClient.sampleValidators({
      size: 1,
    });
    expect(res).toBeDefined();
  });

  test("validatedBy", async () => {
    const res = await pChainClient.validatedBy({
      blockchainID: "11111111111111111111111111111111LpoYY",
    });
    expect(res).toBeDefined();
  });

  test("validates", async () => {
    const res = await pChainClient.validates({
      subnetID: "11111111111111111111111111111111LpoYY",
    });
    expect(res).toBeDefined();
  });

  test("issueTx", async () => {
    const res = await pChainClient.issueTx({
      tx: "0x..",
      encoding: "hex",
    });
    expect(res).toBeDefined();
  });
});
