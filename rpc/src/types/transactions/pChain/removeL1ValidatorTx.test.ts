import { expect, test } from "vitest";
import { bufferToHex, hexToBuffer } from "../../../utils/common.js";
import { PChainRemoveL1ValidatorTx } from "./removeL1ValidatorTx.js";

test("PChainRemoveL1ValidatorTx", () => {
  // Test hex for RemoveL1ValidatorTx
  const testHex =
    "0x00000017000030390000000000000000000000000000000000000000000000000000000000000000000000016870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000700000000ee5be5c000000000000000000000000100000001da2bee01be82ecc00c34f361eda8eb30fb5a715c00000001dfafbdf5c81f635c9257824ff21c8e3e6f7b632ac306e11446ee540d34711a15000000016870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000500000000ee6b2800000000010000000000000000e902a9a86640bfdb1cd0e36c0cc982b83e5765fa4a177205df5c29929d06db9d941f83d5ea985de302015e99252d16469a6610db0000000a0000000100000000";

  const [removeL1ValidatorTx, rest] = PChainRemoveL1ValidatorTx.fromBytes(
    hexToBuffer(testHex)
  );

  expect(removeL1ValidatorTx.toJSON()).toEqual({
    typeId: 23,
    baseTx: {
      typeId: 0,
      networkID: 12345,
      blockchainID:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
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
    },
    nodeId: "0xe902a9a86640bfdb1cd0e36c0cc982b83e5765fa",
    subnetId:
      "0x4a177205df5c29929d06db9d941f83d5ea985de302015e99252d16469a6610db",
    subnetAuth: [0],
  });

  expect(rest.length).toEqual(0);
  expect(bufferToHex(removeL1ValidatorTx.toBytes())).toEqual(testHex);
});
