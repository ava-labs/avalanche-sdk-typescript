import { expect, test } from "vitest";
import { bufferToHex, hexToBuffer } from "../../../../utils/common.js";
import { PChainStakeableLockIn } from "./stakeableLockIn.js";

test("PChainStakeableLockIn", () => {
  // Example hex from documentation
  const testHex =
    "0x00000015000000000000d431f1e1d1c1b1a191817161514131211101f0e0d0c0b0a09080706050403020100000000005000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f0000000500000000075bcd150000000100000000";

  const [stakeableLockIn, rest] = PChainStakeableLockIn.fromBytes(
    hexToBuffer(testHex)
  );
  console.log(stakeableLockIn.toJSON());
  expect(stakeableLockIn.toJSON()).toEqual({
    typeId: 21,
    locktime: 54321n,
    transferableIn: {
      txId: "0xf1e1d1c1b1a191817161514131211101f0e0d0c0b0a090807060504030201000",
      utxoIndex: 5,
      assetId:
        "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
      input: {
        typeId: 5,
        amount: 123456789n,
        signatureIndices: [0],
      },
    },
  });

  expect(rest.length).toEqual(0);
  expect(bufferToHex(stakeableLockIn.toBytes())).toEqual(testHex);
});
