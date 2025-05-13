import { expect, test } from "vitest";
import { bufferToHex, hexToBuffer } from "../../../utils/common";
import { PChainBaseTx } from "./baseTx.js";

test("PChainBaseTx", () => {
  const [baseTx, rest] = PChainBaseTx.fromBytes(
    hexToBuffer(
      "0x00000000000030390000000000000000000000000000000000000000000000000000000000000000000000016870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000700000000ee5be5c000000000000000000000000100000001da2bee01be82ecc00c34f361eda8eb30fb5a715c00000001dfafbdf5c81f635c9257824ff21c8e3e6f7b632ac306e11446ee540d34711a15000000016870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000500000000ee6b2800000000010000000000000000"
    )
  );
  expect(baseTx.toJSON()).toEqual({
    typeId: 0,
    blockchainID:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    memo: "0x",
    networkID: 12345,
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
  });
  expect(rest.length).toEqual(0);
  expect(bufferToHex(baseTx.toBytes())).toEqual(
    "0x00000000000030390000000000000000000000000000000000000000000000000000000000000000000000016870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000700000000ee5be5c000000000000000000000000100000001da2bee01be82ecc00c34f361eda8eb30fb5a715c00000001dfafbdf5c81f635c9257824ff21c8e3e6f7b632ac306e11446ee540d34711a15000000016870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000500000000ee6b2800000000010000000000000000"
  );
});
