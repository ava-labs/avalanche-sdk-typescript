import { expect, test } from "vitest";
import { bufferToHex, hexToBuffer } from "../../../utils/common.js";
import { PChainAddValidatorTx } from "./addValidatorTx.js";

test("", () => {
  const [addValidatorTx, rest] = PChainAddValidatorTx.fromBytes(
    hexToBuffer(
      "0x0000000c000030390000000000000000000000000000000000000000000000000000000000000000000000016870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000700000000ee5be5c000000000000000000000000100000001da2bee01be82ecc00c34f361eda8eb30fb5a715c00000001dfafbdf5c81f635c9257824ff21c8e3e6f7b632ac306e11446ee540d34711a15000000016870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000500000000ee6b2800000000010000000000000000e9094f73698002fd52c90819b457b9fbc866ab80000000005f21f31d000000005f497dc6000000000000d4310000000139c33a499ce4c33a3b09cdd2cfa01ae70dbf2d18b2d7d168524440e55d55008800000007000001d1a94a2000000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c0000000b00000000000000000000000100000001da2bee01be82ecc00c34f361eda8eb30fb5a715c00000064"
    )
  );
  expect(addValidatorTx.toJSON()).toEqual({
    typeId: 12,
    baseTx: {
      typeId: 0,
      networkID: 12345,
      blockchainID:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      outputs: [
        {
          assetId:
            "0x6870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a",
          output: {
            addresses: ["0xda2bee01be82ecc00c34f361eda8eb30fb5a715c"],
            amount: 3999000000n,
            locktime: 0n,
            threshold: 1,
            typeId: 7,
          },
        },
      ],
      inputs: [
        {
          assetId:
            "0x6870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a",
          input: {
            amount: 4000000000n,
            signatureIndices: [0],
            typeId: 5,
          },
          txId: "0xdfafbdf5c81f635c9257824ff21c8e3e6f7b632ac306e11446ee540d34711a15",
          utxoIndex: 1,
        },
      ],
      memo: "0x",
    },
    validator: {
      nodeId: "0xe9094f73698002fd52c90819b457b9fbc866ab80",
      startTime: 1596060445n,
      endTime: 1598651846n,
      weight: 54321n,
    },
    stake: [
      {
        assetId:
          "0x39c33a499ce4c33a3b09cdd2cfa01ae70dbf2d18b2d7d168524440e55d550088",
        output: {
          addresses: ["0x3cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c"],
          amount: 2000000000000n,
          locktime: 0n,
          threshold: 1,
          typeId: 7,
        },
      },
    ],
    rewardsOwner: {
      typeId: 11,
      locktime: 0n,
      threshold: 1,
      addresses: ["0xda2bee01be82ecc00c34f361eda8eb30fb5a715c"],
    },
    shares: 100,
  });
  expect(rest.length).toEqual(0);
  expect(bufferToHex(addValidatorTx.toBytes())).toEqual(
    "0x0000000c000030390000000000000000000000000000000000000000000000000000000000000000000000016870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000700000000ee5be5c000000000000000000000000100000001da2bee01be82ecc00c34f361eda8eb30fb5a715c00000001dfafbdf5c81f635c9257824ff21c8e3e6f7b632ac306e11446ee540d34711a15000000016870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000500000000ee6b2800000000010000000000000000e9094f73698002fd52c90819b457b9fbc866ab80000000005f21f31d000000005f497dc6000000000000d4310000000139c33a499ce4c33a3b09cdd2cfa01ae70dbf2d18b2d7d168524440e55d55008800000007000001d1a94a2000000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c0000000b00000000000000000000000100000001da2bee01be82ecc00c34f361eda8eb30fb5a715c00000064"
  );
});
