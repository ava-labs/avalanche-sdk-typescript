import { expect, test } from "vitest";
import { bufferToHex, hexToBuffer } from "../../../utils/common.js";
import { PChainBaseTx } from "./baseTx.js";
import { PChainImportTx } from "./importTx.js";
import { PChainTransferableInput } from "./input/transferableInput.js";
import { PChainTransferInput } from "./input/transferInput.js";
import { PChainTransferableOutput } from "./output/transferableOutput.js";
import { PChainTransferOutput } from "./output/transferOutput.js";

test("PChainImportTx", () => {
  // Example from documentation
  const testHex =
    "0x00000011000030390000000000000000000000000000000000000000000000000000000000000000000000016870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000700000000ee5be5c000000000000000000000000100000001da2bee01be82ecc00c34f361eda8eb30fb5a715c00000001dfafbdf5c81f635c9257824ff21c8e3e6f7b632ac306e11446ee540d34711a15000000016870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000500000000ee6b2800000000010000000000000000787cd3243c002e9bf5bbbaea8a42a16c1a19cc105047c66996807cbf16acee1000000001dfafbdf5c81f635c9257824ff21c8e3e6f7b632ac306e11446ee540d34711a15000000016870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000500000000ee6b28000000000100000000";

  const [importTx, rest] = PChainImportTx.fromBytes(hexToBuffer(testHex));

  expect(importTx.toJSON()).toEqual({
    typeId: 17,
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
    sourceChain:
      "0x787cd3243c002e9bf5bbbaea8a42a16c1a19cc105047c66996807cbf16acee10",
    ins: [
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
  expect(bufferToHex(importTx.toBytes())).toEqual(testHex);

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

  const transferableInput = PChainTransferableInput({
    assetId:
      "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    input: PChainTransferInput({
      typeId: 5,
      amount: 4000000000,
      signatureIndices: [0],
    }),
    txId: "0xf1e1d1c1b1a191817161514131211100f0e0d0c0b0a09080706050403020100",
    utxoIndex: 5,
  });

  const importTxFromJson = PChainImportTx({
    baseTx,
    sourceChain:
      "0x787cd3243c002e9bf5bbbaea8a42a16c1a19cc105047c66996807cbf16acee10",
    ins: [transferableInput as any],
  });

  expect(importTxFromJson.toJSON()).toEqual({
    typeId: 17,
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
    sourceChain:
      "0x787cd3243c002e9bf5bbbaea8a42a16c1a19cc105047c66996807cbf16acee10",
    ins: [
      {
        assetId:
          "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
        input: {
          amount: 4000000000n,
          signatureIndices: [0],
          typeId: 5,
        },
        txId: "0x0f1e1d1c1b1a191817161514131211100f0e0d0c0b0a09080706050403020100",
        utxoIndex: 5,
      },
    ],
  });
});
