import { expect, test } from "vitest";
import { bufferToHex, hexToBuffer } from "../../../../utils/common.js";
import { PChainStakeableLockOut } from "./stakeableLockOut.js";

test("PChainStakeableLockOut", () => {
  // Example hex from documentation
  const testHex =
    "0x00000016000000000000d4316870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000700000000ee5be5c000000000000000000000000100000001da2bee01be82ecc00c34f361eda8eb30fb5a715c";

  const [stakeableLockOut, rest] = PChainStakeableLockOut.fromBytes(
    hexToBuffer(testHex)
  );

  expect(stakeableLockOut.toJSON()).toEqual({
    typeId: 22,
    locktime: 54321n,
    transferableOut: {
      assetId:
        "0x6870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a",
      output: {
        typeId: 7,
        amount: 3999000000n,
        locktime: 0n,
        threshold: 1,
        addresses: ["0xda2bee01be82ecc00c34f361eda8eb30fb5a715c"],
      },
    },
  });

  expect(rest.length).toEqual(0);
  expect(bufferToHex(stakeableLockOut.toBytes())).toEqual(testHex);
});
