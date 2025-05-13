import { expect, test } from "vitest";
import { bufferToHex, hexToBuffer } from "../../../../utils/common";
import { PChainTransferableInput } from "./transferableInput";
import { PChainTransferInput } from "./transferInput";
test("PChainTransferableInput", () => {
  const [transferableInput, rest] = PChainTransferableInput.fromBytes(
    hexToBuffer(
      "0xdfafbdf5c81f635c9257824ff21c8e3e6f7b632ac306e11446ee540d34711a15000000016870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000500000000ee6b28000000000100000000"
    )
  );
  expect(transferableInput.toJSON()).toEqual({
    assetId:
      "0x6870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a",
    txId: "0xdfafbdf5c81f635c9257824ff21c8e3e6f7b632ac306e11446ee540d34711a15",
    utxoIndex: 1,
    input: {
      typeId: 5,
      amount: 4000000000n,
      signatureIndices: [0],
    },
  });
  expect(rest.length).toEqual(0);
  expect(bufferToHex(transferableInput.toBytes())).toEqual(
    "0xdfafbdf5c81f635c9257824ff21c8e3e6f7b632ac306e11446ee540d34711a15000000016870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000500000000ee6b28000000000100000000"
  );
});

test("PChainTransferableInput custom", () => {
  const transferableInput = PChainTransferableInput({
    assetId:
      "0x6870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a",
    utxoIndex: 1,
    txId: "0xdfafbdf5c81f635c9257824ff21c8e3e6f7b632ac306e11446ee540d34711a15",
    input: PChainTransferInput({
      typeId: 5,
      amount: 4000000000,
      signatureIndices: [0],
    }),
  });

  expect(transferableInput.toJSON()).toEqual({
    assetId:
      "0x6870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a",
    txId: "0xdfafbdf5c81f635c9257824ff21c8e3e6f7b632ac306e11446ee540d34711a15",
    utxoIndex: 1,
    input: {
      typeId: 5,
      amount: 4000000000n,
      signatureIndices: [0],
    },
  });
});
