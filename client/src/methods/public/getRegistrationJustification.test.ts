import { utils } from "@avalabs/avalanchejs";
import { sha256 } from "@noble/hashes/sha256";
import { createClient, custom } from "viem";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { getRegistrationJustification } from "./getRegistrationJustification.js";
import { GetRegistrationJustificationParams } from "./types/getRegistrationJustification.js";
import {
  computeDerivedID,
  marshalConvertSubnetToL1TxDataJustification,
} from "./utils.js";

// Mock viem actions
const mockGetBlockNumber = vi.fn();
const mockGetLogs = vi.fn();

vi.mock("viem/actions", () => ({
  getBlockNumber: (...args: any[]) => mockGetBlockNumber(...args),
  getLogs: (...args: any[]) => mockGetLogs(...args),
}));

const createMockClient = () =>
  createClient({
    chain: avalanche,
    transport: custom({
      request: vi.fn(async () => null) as any,
    }),
  });

describe("getRegistrationJustification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Bootstrap validator cases", () => {
    test("should return justification for bootstrap validator at index 0", async () => {
      const client = createMockClient();
      const subnetIDStr = "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ";
      const subnetIDBytes = utils.base58check.decode(subnetIDStr);
      const index = 0;

      // Compute the expected validation ID
      const derivedID = computeDerivedID(subnetIDBytes, index);
      const validationIDHash = sha256(derivedID);
      const validationIDHex = utils.bufferToHex(validationIDHash); // 0x9a33b98f8bdef88c976f8d2c4a82ba4bb988f9297dc6ebddb4844f56b34131e9
      const params: GetRegistrationJustificationParams = {
        validationID: validationIDHex,
        subnetIDStr,
        maxBootstrapValidators: 10,
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).not.toBeNull();
      expect(result.justification).toBeInstanceOf(Uint8Array);

      // Verify the justification matches expected format
      const expectedJustification = Uint8Array.from([
        10, 36, 10, 32, 159, 196, 242, 64, 83, 40, 153, 94, 216, 191, 136, 121,
        207, 131, 69, 158, 254, 20, 2, 105, 19, 104, 233, 255, 126, 49, 10, 91,
        209, 145, 136, 116, 16, 0,
      ]);
      console.log("expectedJustification", expectedJustification);
      expect(result.justification).toEqual(expectedJustification);
    });

    test("should return justification for bootstrap validator at index 5", async () => {
      const client = createMockClient();
      const subnetIDStr = "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ";
      const subnetIDBytes = utils.base58check.decode(subnetIDStr);
      const index = 5;

      const derivedID = computeDerivedID(subnetIDBytes, index);
      const validationIDHash = sha256(derivedID);
      const validationIDHex = utils.bufferToHex(validationIDHash); // 0x5ecf5d9c6fe20c4e43afda8f5cc97e7baef800ed485a60f7370fe26fdea75e3a
      const params: GetRegistrationJustificationParams = {
        validationID: validationIDHex,
        subnetIDStr,
        maxBootstrapValidators: 10,
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).not.toBeNull();

      const expectedJustification = Uint8Array.from([
        10, 36, 10, 32, 159, 196, 242, 64, 83, 40, 153, 94, 216, 191, 136, 121,
        207, 131, 69, 158, 254, 20, 2, 105, 19, 104, 233, 255, 126, 49, 10, 91,
        209, 145, 136, 116, 16, 5,
      ]);
      expect(result.justification).toEqual(expectedJustification);
    });

    test("should return null when validation ID is not in bootstrap range", async () => {
      const client = createMockClient();
      mockGetBlockNumber.mockResolvedValue(1000n);
      mockGetLogs.mockResolvedValue([]);

      const subnetIDStr = "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ";
      const validationIDHex =
        "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304";

      const params: GetRegistrationJustificationParams = {
        validationID: validationIDHex,
        subnetIDStr,
        maxBootstrapValidators: 10,
        chunkSize: 200,
        maxChunks: 1,
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).toBeNull();
      expect(mockGetBlockNumber).toHaveBeenCalled();
      expect(mockGetLogs).toHaveBeenCalled();
    });

    test("should use default maxBootstrapValidators when not provided", async () => {
      const client = createMockClient();
      const subnetIDStr = "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ";
      const subnetIDBytes = utils.base58check.decode(subnetIDStr);
      const index = 50; // Within default range of 100

      const derivedID = computeDerivedID(subnetIDBytes, index);
      const validationIDHash = sha256(derivedID);
      const validationIDHex = utils.bufferToHex(validationIDHash);

      const params: GetRegistrationJustificationParams = {
        validationID: validationIDHex,
        subnetIDStr,
        // maxBootstrapValidators not provided, should default to 100
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).not.toBeNull();
      const expectedJustification = marshalConvertSubnetToL1TxDataJustification(
        subnetIDBytes,
        index
      );
      expect(result.justification).toEqual(expectedJustification);
    });
  });

  describe("Warp log search cases", () => {
    test("should search Warp logs when validation ID is not a bootstrap validator", async () => {
      const client = createMockClient();
      const latestBlock = 1000n;
      mockGetBlockNumber.mockResolvedValue(latestBlock);
      mockGetLogs.mockResolvedValue([]);

      const subnetIDStr = "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ";
      const targetValidationIDHex =
        "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304";

      const params: GetRegistrationJustificationParams = {
        validationID: targetValidationIDHex,
        subnetIDStr,
        maxBootstrapValidators: 10,
        chunkSize: 200,
        maxChunks: 10,
      };

      const result = await getRegistrationJustification(client, params);

      expect(mockGetBlockNumber).toHaveBeenCalled();
      expect(mockGetLogs).toHaveBeenCalled();
      // Result will be null since we're returning empty logs, but we've tested the search path
      expect(result.justification).toBeNull();
    });

    test("should search in descending order by default", async () => {
      const client = createMockClient();
      const latestBlock = 1000n;
      mockGetBlockNumber.mockResolvedValue(latestBlock);
      mockGetLogs.mockResolvedValue([]);

      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
        chunkSize: 200,
        maxChunks: 1,
      };

      await getRegistrationJustification(client, params);

      expect(mockGetLogs).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          fromBlock: expect.any(BigInt),
          toBlock: expect.any(BigInt),
        })
      );
    });

    test("should search in descending order and stop at genesis block", async () => {
      const client = createMockClient();
      const latestBlock = 1000n;
      mockGetBlockNumber.mockResolvedValue(latestBlock);
      mockGetLogs.mockResolvedValue([]);

      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
        chunkSize: 200,
        maxChunks: 100,
      };

      await getRegistrationJustification(client, params);

      expect(mockGetLogs).toHaveBeenCalledTimes(6);
      expect(mockGetLogs).toHaveBeenNthCalledWith(
        6,
        expect.anything(),
        expect.objectContaining({
          toBlock: 0n,
        })
      );
    });

    test("should search in ascending order when specified", async () => {
      const client = createMockClient();
      const latestBlock = 1000n;
      mockGetBlockNumber.mockResolvedValue(latestBlock);
      mockGetLogs.mockResolvedValue([]);

      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
        chunkSize: 200,
        maxChunks: 1,
        searchOrder: "asc",
      };

      await getRegistrationJustification(client, params);

      expect(mockGetLogs).toHaveBeenCalledTimes(1);
      expect(mockGetLogs).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({
          fromBlock: 1000n,
          toBlock: 1000n,
        })
      );
    });

    test("should respect startBlock parameter", async () => {
      const client = createMockClient();
      const latestBlock = 1000n;
      mockGetBlockNumber.mockResolvedValue(latestBlock);
      mockGetLogs.mockResolvedValue([]);

      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
        chunkSize: 200,
        maxChunks: 1,
        startBlock: 500,
      };

      await getRegistrationJustification(client, params);

      expect(mockGetLogs).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          fromBlock: expect.any(BigInt),
          toBlock: 500n,
        })
      );
    });

    test("should use latest block when startBlock is 'latest'", async () => {
      const client = createMockClient();
      const latestBlock = 1000n;
      mockGetBlockNumber.mockResolvedValue(latestBlock);
      mockGetLogs.mockResolvedValue([]);

      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
        chunkSize: 200,
        maxChunks: 1,
        startBlock: "latest",
      };

      await getRegistrationJustification(client, params);

      expect(mockGetLogs).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          toBlock: latestBlock,
        })
      );
    });

    test("should stop at genesis block in descending order", async () => {
      const client = createMockClient();
      const latestBlock = 1000n;
      mockGetBlockNumber.mockResolvedValue(latestBlock);
      mockGetLogs.mockResolvedValue([]);

      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
        chunkSize: 2000, // Large chunk to reach genesis
        maxChunks: 10,
        startBlock: 100,
      };

      await getRegistrationJustification(client, params);

      expect(mockGetLogs).toHaveBeenCalledTimes(1);
    });

    test("should stop at latest block in ascending order", async () => {
      const client = createMockClient();
      const latestBlock = 1000n;
      mockGetBlockNumber.mockResolvedValue(latestBlock);
      mockGetLogs.mockResolvedValue([]);

      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
        chunkSize: 200,
        maxChunks: 10,
        searchOrder: "asc",
        startBlock: 0,
      };

      await getRegistrationJustification(client, params);
      expect(mockGetLogs).toHaveBeenCalledTimes(6);
      expect(mockGetLogs).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({
          fromBlock: 0n,
          toBlock: 199n,
        })
      );
      expect(mockGetLogs).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expect.objectContaining({
          fromBlock: 200n,
          toBlock: 399n,
        })
      );
      expect(mockGetLogs).toHaveBeenNthCalledWith(
        3,
        expect.anything(),
        expect.objectContaining({
          fromBlock: 400n,
          toBlock: 599n,
        })
      );
      expect(mockGetLogs).toHaveBeenNthCalledWith(
        4,
        expect.anything(),
        expect.objectContaining({
          fromBlock: 600n,
          toBlock: 799n,
        })
      );
      expect(mockGetLogs).toHaveBeenNthCalledWith(
        5,
        expect.anything(),
        expect.objectContaining({
          fromBlock: 800n,
          toBlock: 999n,
        })
      );
      expect(mockGetLogs).toHaveBeenNthCalledWith(
        6,
        expect.anything(),
        expect.objectContaining({
          fromBlock: 1000n,
          toBlock: 1000n,
        })
      );
    });

    test("should respect maxChunks limit", async () => {
      const client = createMockClient();
      const latestBlock = 10000n;
      mockGetBlockNumber.mockResolvedValue(latestBlock);
      mockGetLogs.mockResolvedValue([]);

      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
        chunkSize: 200,
        maxChunks: 2,
      };

      await getRegistrationJustification(client, params);

      // Should be called maxChunks times
      expect(mockGetLogs).toHaveBeenCalledTimes(2);
    });

    test("should handle empty Warp logs", async () => {
      const client = createMockClient();
      const latestBlock = 1000n;
      mockGetBlockNumber.mockResolvedValue(latestBlock);
      mockGetLogs.mockResolvedValue([]);

      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
        chunkSize: 200,
        maxChunks: 1,
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).toBeNull();
    });

    test("should give valid justification for a validation ID that from warp logs", async () => {
      const client = createMockClient();
      const latestBlock = 1000n;
      mockGetBlockNumber.mockResolvedValue(latestBlock);
      mockGetLogs.mockResolvedValue([
        {
          eventName: "SendWarpMessage",
          args: {
            sourceAddress: "0xfAcadE0000000000000000000000000000000000",
            unsignedMessageID:
              "0x9e883c90bee7398d20cf3dd1e96b53a1b8b929833888532e2a2e37f2f6067c39",
            message:
              "0x00000000000595d7bbe6942f60afd7be8091b89d4e4ed6183862605809c5395dca8dde94b3a3000000d800000000000100000014facade0000000000000000000000000000000000000000b60000000000019fc4f2405328995ed8bf8879cf83459efe1402691368e9ff7e310a5bd1918874000000147c9968cefdb8445b2426dd020f12d246defcb11294ab445df7ca4158cf63b66b6c463e9995b380441863f89231d3cd468ecdf7a96b080d3e96e20d74d9f2cd4f96d9dc40000000006931432e0000000100000001fc29235b2bdabea93b3546331fc8dc3a941391b80000000100000001fc29235b2bdabea93b3546331fc8dc3a941391b8000000000000000a",
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
      ]);

      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
        chunkSize: 200,
        maxChunks: 1,
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).toStrictEqual(
        Uint8Array.from([
          18, 182, 1, 0, 0, 0, 0, 0, 1, 159, 196, 242, 64, 83, 40, 153, 94, 216,
          191, 136, 121, 207, 131, 69, 158, 254, 20, 2, 105, 19, 104, 233, 255,
          126, 49, 10, 91, 209, 145, 136, 116, 0, 0, 0, 20, 124, 153, 104, 206,
          253, 184, 68, 91, 36, 38, 221, 2, 15, 18, 210, 70, 222, 252, 177, 18,
          148, 171, 68, 93, 247, 202, 65, 88, 207, 99, 182, 107, 108, 70, 62,
          153, 149, 179, 128, 68, 24, 99, 248, 146, 49, 211, 205, 70, 142, 205,
          247, 169, 107, 8, 13, 62, 150, 226, 13, 116, 217, 242, 205, 79, 150,
          217, 220, 64, 0, 0, 0, 0, 105, 49, 67, 46, 0, 0, 0, 1, 0, 0, 0, 1,
          252, 41, 35, 91, 43, 218, 190, 169, 59, 53, 70, 51, 31, 200, 220, 58,
          148, 19, 145, 184, 0, 0, 0, 1, 0, 0, 0, 1, 252, 41, 35, 91, 43, 218,
          190, 169, 59, 53, 70, 51, 31, 200, 220, 58, 148, 19, 145, 184, 0, 0,
          0, 0, 0, 0, 0, 10,
        ])
      );
    });

    test("should handle invalid justification for a validation ID that from warp logs", async () => {
      const client = createMockClient();
      const latestBlock = 1000n;
      mockGetBlockNumber.mockResolvedValue(latestBlock);
      mockGetLogs.mockResolvedValue([
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
      ]);

      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
        chunkSize: 200,
        maxChunks: 1,
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).toBeNull();
    });
  });

  describe("Error cases", () => {
    test("should return null for invalid validation ID (wrong length)", async () => {
      const client = createMockClient();
      const params: GetRegistrationJustificationParams = {
        validationID: "0x1234", // Too short
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).toBeNull();
      console.log(result.error);
      expect(result.error).toBe(
        "Failed to decode provided validationIDHex '0x1234': Decoded validationID must be 32 bytes, got 2"
      );
    });

    test("should return null for invalid validation ID (not hex)", async () => {
      const client = createMockClient();
      const params: GetRegistrationJustificationParams = {
        validationID: "notAValidHexString",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).toBeNull();
      expect(result.error).toContain(
        "Failed to decode provided validationIDHex"
      );
    });

    test("should return null for invalid subnet ID", async () => {
      const client = createMockClient();
      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304",
        subnetIDStr: "invalid-subnet-id",
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).toBeNull();
      expect(result.error).toContain("Failed to decode provided SubnetID");
    });

    test("should return null when subnetIDStr is empty", async () => {
      const client = createMockClient();
      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304",
        subnetIDStr: "",
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).toBeNull();
      expect(result.error).toContain("Found empty subnetIDStr");
    });

    test("should handle getBlockNumber errors gracefully", async () => {
      const client = createMockClient();
      mockGetBlockNumber.mockRejectedValue(new Error("RPC error"));

      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).toBeNull();
      expect(result.error).toContain(
        "Error fetching or decoding logs for ValidationID"
      );
    });

    test("should handle getLogs errors gracefully", async () => {
      const client = createMockClient();
      const latestBlock = 1000n;
      mockGetBlockNumber.mockResolvedValue(latestBlock);
      mockGetLogs.mockRejectedValue(new Error("RPC error"));

      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
        chunkSize: 200,
        maxChunks: 1,
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).toBeNull();
      expect(result.error).toContain(
        "Error fetching or decoding logs for ValidationID"
      );
    });

    test("should handle logs with missing message field", async () => {
      const client = createMockClient();
      const latestBlock = 1000n;
      mockGetBlockNumber.mockResolvedValue(latestBlock);
      mockGetLogs.mockResolvedValue([
        {
          eventName: "SendWarpMessage",
          args: {
            sourceAddress: "0xfAcadE0000000000000000000000000000000000",
            unsignedMessageID:
              "0x9e883c90bee7398d20cf3dd1e96b53a1b8b929833888532e2a2e37f2f6067c39",
            // message field missing
          },
          address: "0x0200000000000000000000000000000000000005",
          topics: [],
          data: "0x",
          blockNumber: 6n,
          transactionHash:
            "0xa8935a010bb7bdea63580b8fc366641f801d2e7a86d98b6b5ade3b33bf5ecdce",
          transactionIndex: 0,
          blockHash:
            "0xba44797cac7ba95176f4fc5e1395cea55f8e766782bc9625031117e067641fe6",
          logIndex: 0,
          removed: false,
        },
      ]);

      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
        chunkSize: 200,
        maxChunks: 1,
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).toBeNull();
    });

    test("should handle logs with invalid message format", async () => {
      const client = createMockClient();
      const latestBlock = 1000n;
      mockGetBlockNumber.mockResolvedValue(latestBlock);
      mockGetLogs.mockResolvedValue([
        {
          eventName: "SendWarpMessage",
          args: {
            sourceAddress: "0xfAcadE0000000000000000000000000000000000",
            unsignedMessageID:
              "0x9e883c90bee7398d20cf3dd1e96b53a1b8b929833888532e2a2e37f2f6067c39",
            message: "0xinvalid",
          },
          address: "0x0200000000000000000000000000000000000005",
          topics: [],
          data: "0x",
          blockNumber: 6n,
          transactionHash:
            "0xa8935a010bb7bdea63580b8fc366641f801d2e7a86d98b6b5ade3b33bf5ecdce",
          transactionIndex: 0,
          blockHash:
            "0xba44797cac7ba95176f4fc5e1395cea55f8e766782bc9625031117e067641fe6",
          logIndex: 0,
          removed: false,
        },
      ]);

      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
        chunkSize: 200,
        maxChunks: 1,
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).toBeNull();
    });

    test("should handle empty validation ID", async () => {
      const client = createMockClient();
      const params: GetRegistrationJustificationParams = {
        validationID: "",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).toBeNull();
      expect(result.error).toContain("Found empty validationID");
    });
  });

  describe("Edge cases", () => {
    test("should handle validation ID with 0x prefix", async () => {
      const client = createMockClient();
      const subnetIDStr = "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ";
      const subnetIDBytes = utils.base58check.decode(subnetIDStr);
      const index = 0;

      const derivedID = computeDerivedID(subnetIDBytes, index);
      const validationIDHash = sha256(derivedID);
      const validationIDHex = utils.bufferToHex(validationIDHash);

      const params: GetRegistrationJustificationParams = {
        validationID: validationIDHex, // Already has 0x prefix from bufferToHex
        subnetIDStr,
        maxBootstrapValidators: 10,
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).not.toBeNull();
    });

    test("should handle validation ID without 0x prefix", async () => {
      const client = createMockClient();
      const subnetIDStr = "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ";
      const subnetIDBytes = utils.base58check.decode(subnetIDStr);
      const index = 0;

      const derivedID = computeDerivedID(subnetIDBytes, index);
      const validationIDHash = sha256(derivedID);
      const validationIDHex = utils.bufferToHex(validationIDHash);
      const validationIDWithoutPrefix = validationIDHex.slice(2);

      const params: GetRegistrationJustificationParams = {
        validationID: validationIDWithoutPrefix,
        subnetIDStr,
        maxBootstrapValidators: 10,
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).toBeNull();
      expect(result.error).toContain(
        "Failed to decode provided validationIDHex"
      );
    });

    test("should handle base58check encoded validation ID", async () => {
      const client = createMockClient();
      const subnetIDStr = "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ";
      const subnetIDBytes = utils.base58check.decode(subnetIDStr);
      const index = 0;

      const derivedID = computeDerivedID(subnetIDBytes, index);
      const validationIDHash = sha256(derivedID);
      const validationIDBase58 = utils.base58check.encode(validationIDHash);

      const params: GetRegistrationJustificationParams = {
        validationID: validationIDBase58,
        subnetIDStr,
        maxBootstrapValidators: 10,
      };

      const result = await getRegistrationJustification(client, params);

      expect(result.justification).not.toBeNull();
    });

    test("should use default chunkSize when not provided", async () => {
      const client = createMockClient();
      const latestBlock = 1000n;
      mockGetBlockNumber.mockResolvedValue(latestBlock);
      mockGetLogs.mockResolvedValue([]);

      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4304",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
        // chunkSize not provided, should default to 2000
        maxChunks: 1,
      };

      await getRegistrationJustification(client, params);

      // Verify that the chunk size used is the default (2000)
      const callArgs = mockGetLogs.mock.calls[0][1];
      const fromBlock = Number(callArgs.fromBlock);
      const toBlock = Number(callArgs.toBlock);
      const chunkSize = toBlock - fromBlock;
      expect(chunkSize).toBeLessThanOrEqual(2000);
    });

    test("should use default maxChunks when not provided", async () => {
      const client = createMockClient();
      const latestBlock = 100000n;
      mockGetBlockNumber.mockResolvedValue(latestBlock);
      mockGetLogs.mockResolvedValue([
        {
          eventName: "SendWarpMessage",
          args: {
            sourceAddress: "0xfAcadE0000000000000000000000000000000000",
            unsignedMessageID:
              "0x9e883c90bee7398d20cf3dd1e96b53a1b8b929833888532e2a2e37f2f6067c39",
            message:
              "0x00000000000595d7bbe6942f60afd7be8091b89d4e4ed6183862605809c5395dca8dde94b3a3000000d800000000000100000014facade0000000000000000000000000000000000000000b60000000000019fc4f2405328995ed8bf8879cf83459efe1402691368e9ff7e310a5bd1918874000000147c9968cefdb8445b2426dd020f12d246defcb11294ab445df7ca4158cf63b66b6c463e9995b380441863f89231d3cd468ecdf7a96b080d3e96e20d74d9f2cd4f96d9dc40000000006931432e0000000100000001fc29235b2bdabea93b3546331fc8dc3a941391b80000000100000001fc29235b2bdabea93b3546331fc8dc3a941391b8000000000000000a",
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
      ]);

      const params: GetRegistrationJustificationParams = {
        validationID:
          "0x3b950bb5919169ad07b4f483ab2373f9b474414b30378abbb7ea9b493c5a4305",
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
        chunkSize: 200,
        // maxChunks not provided, should default to 100
      };

      await getRegistrationJustification(client, params);

      // Should be called up to default maxChunks (100) times
      expect(mockGetLogs).toHaveBeenCalledTimes(100);
    });

    test("should handle logs with wrong message type ID", async () => {
      const client = createMockClient();
      const latestBlock = 1000n;
      mockGetBlockNumber.mockResolvedValue(latestBlock);

      // Use a real message hex from the terminal output but it won't match our validation ID
      // This tests that logs with different message types are skipped
      const messageHex =
        "0x00000000000595d7bbe6942f60afd7be8091b89d4e4ed6183862605809c5395dca8dde94b3a3000000d800000000000100000014facade0000000000000000000000000000000000000000b60000000000019fc4f2405328995ed8bf8879cf83459efe1402691368e9ff7e310a5bd1918874000000147c9968cefdb8445b2426dd020f12d246defcb11294ab445df7ca4158cf63b66b6c463e9995b380441863f89231d3cd468ecdf7a96b080d3e96e20d74d9f2cd4f96d9dc40000000006931432e0000000100000001fc29235b2bdabea93b3546331fc8dc3a941391b80000000100000001fc29235b2bdabea93b3546331fc8dc3a941391b8000000000000000a";

      mockGetLogs.mockResolvedValue([
        {
          eventName: "SendWarpMessage",
          args: {
            sourceAddress: "0xfAcadE0000000000000000000000000000000000",
            unsignedMessageID:
              "0x9e883c90bee7398d20cf3dd1e96b53a1b8b929833888532e2a2e37f2f6067c39",
            message: messageHex,
          },
          address: "0x0200000000000000000000000000000000000005",
          topics: [
            "0x56600c567728a800c0aa927500f831cb451df66a7af570eb4df4dfbf4674887d",
            "0x000000000000000000000000facade0000000000000000000000000000000000",
            "0x9e883c90bee7398d20cf3dd1e96b53a1b8b929833888532e2a2e37f2f6067c39",
          ],
          data: "0x",
          blockNumber: 6n,
          transactionHash:
            "0xa8935a010bb7bdea63580b8fc366641f801d2e7a86d98b6b5ade3b33bf5ecdce",
          transactionIndex: 0,
          blockHash:
            "0xba44797cac7ba95176f4fc5e1395cea55f8e766782bc9625031117e067641fe6",
          logIndex: 0,
          removed: false,
        },
      ]);

      const params: GetRegistrationJustificationParams = {
        validationID:
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", // Different validation ID
        subnetIDStr: "2DN6PTi2uXNCzzNz1p2ckGcW2eqTfpt2kv2a1h7EV36hYV3XRJ",
        maxBootstrapValidators: 10,
        chunkSize: 200,
        maxChunks: 1,
      };

      const result = await getRegistrationJustification(client, params);

      // Should process the log but not find a match
      expect(result.justification).toBeNull();
    });
  });
});
