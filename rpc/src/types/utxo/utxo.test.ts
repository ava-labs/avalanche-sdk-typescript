import { expect, test } from "vitest";
import { bufferToHex, hexToBuffer } from "../../utils/common.js";
import { UTXO } from "./utxo.js";

test("UTXO", () => {
  // Test hex for UTXO
  const testHex =
    "0x0000f966750f438867c3c9828ddcdbe660e21ccdbb36a9276958f011ba472f75d4e700000000000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f000000070000000000003039000000000000d431000000010000000251025c61fbcfc078f69334f834be6dd26d55a955c3344128e060128ede3523a24a461c8943ab0859";

  const [utxo, rest] = UTXO.fromBytes(hexToBuffer(testHex));
  expect(utxo.toJSON()).toEqual({
    codecId: "0",
    txId: "0xf966750f438867c3c9828ddcdbe660e21ccdbb36a9276958f011ba472f75d4e7",
    UTXOIndex: 0,
    output: {
      assetId:
        "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
      output: {
        typeId: 7,
        amount: 12345n,
        locktime: 54321n,
        threshold: 1,
        addresses: [
          "0x51025c61fbcfc078f69334f834be6dd26d55a955",
          "0xc3344128e060128ede3523a24a461c8943ab0859",
        ],
      },
    },
  });
  expect(rest.length).toEqual(0);
  expect(bufferToHex(utxo.toBytes())).toEqual(testHex);
});
