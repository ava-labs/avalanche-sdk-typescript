import { expect, test } from "vitest";
import { bufferToHex, hexToBuffer } from "../../../utils/common.js";
import { PChainBaseTx } from "./baseTx.js";
import { PChainExportTx } from "./exportTx.js";
import { PChainTransferableInput } from "./input/transferableInput.js";
import { PChainTransferInput } from "./input/transferInput.js";
import { PChainTransferableOutput } from "./output/transferableOutput.js";
import { PChainTransferOutput } from "./output/transferOutput.js";

test("PChainExportTx", () => {
  // Example from documentation
  const testHex =
    "0x00000012000030390000000000000000000000000000000000000000000000000000000000000000000000016870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000700000000ee5be5c000000000000000000000000100000001da2bee01be82ecc00c34f361eda8eb30fb5a715c00000001dfafbdf5c81f635c9257824ff21c8e3e6f7b632ac306e11446ee540d34711a15000000016870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000500000000ee6b28000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000016870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000700000000ee5be5c000000000000000000000000100000001da2bee01be82ecc00c34f361eda8eb30fb5a715c";

  const [exportTx, rest] = PChainExportTx.fromBytes(hexToBuffer(testHex));

  expect(exportTx.toJSON()).toEqual({
    typeId: 18,
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
    destinationChain:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    outs: [
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
  });

  expect(rest.length).toEqual(0);
  expect(bufferToHex(exportTx.toBytes())).toEqual(testHex);

  // Test creating from JSON
  const baseTx = PChainBaseTx({
    networkID: 12345,
    blockchainID:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    outputs: [
      PChainTransferableOutput({
        assetId:
          "0x6870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a",
        output: PChainTransferOutput({
          typeId: 7,
          amount: 3999000000,
          locktime: 0,
          threshold: 1,
          addresses: ["0xda2bee01be82ecc00c34f361eda8eb30fb5a715c"],
        }),
      }) as any,
    ],
    inputs: [
      PChainTransferableInput({
        assetId:
          "0x6870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a",
        input: PChainTransferInput({
          typeId: 5,
          amount: 4000000000,
          signatureIndices: [0],
        }),
        txId: "0xdfafbdf5c81f635c9257824ff21c8e3e6f7b632ac306e11446ee540d34711a15",
        utxoIndex: 1,
      }) as any,
    ],
    memo: "0x",
  });

  const transferableOutput = PChainTransferableOutput({
    assetId:
      "0x6870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a",
    output: PChainTransferOutput({
      typeId: 7,
      amount: 3999000000,
      locktime: 0,
      threshold: 1,
      addresses: ["0xda2bee01be82ecc00c34f361eda8eb30fb5a715c"],
    }),
  });

  const exportTxFromJson = PChainExportTx({
    baseTx,
    destinationChain:
      "0x787cd3243c002e9bf5bbbaea8a42a16c1a19cc105047c66996807cbf16acee10",
    outs: [transferableOutput as any],
  });

  expect(exportTxFromJson.toJSON()).toEqual({
    typeId: 18,
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
    destinationChain:
      "0x787cd3243c002e9bf5bbbaea8a42a16c1a19cc105047c66996807cbf16acee10",
    outs: [
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
  });
});
