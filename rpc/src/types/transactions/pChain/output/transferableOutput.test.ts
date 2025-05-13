import { expect, test } from "vitest";
import { bufferToHex, hexToBuffer } from "../../../../utils/common";
import { PChainTransferableOutput } from "./transferableOutput.js";
import { PChainTransferOutput } from "./transferOutput.js";

test("PChainTransferableOutput", () => {
  const [transferableOutput, rest] = PChainTransferableOutput.fromBytes(
    hexToBuffer(
      "0x6870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000700000000ee5be5c000000000000000000000000100000001da2bee01be82ecc00c34f361eda8eb30fb5a715c"
    )
  );
  expect(transferableOutput.toJSON()).toEqual({
    assetId:
      "0x6870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a",
    output: {
      typeId: 7,
      amount: 3999000000n,
      locktime: 0n,
      threshold: 1,
      addresses: ["0xda2bee01be82ecc00c34f361eda8eb30fb5a715c"],
    },
  });
  expect(rest.length).toEqual(0);
  expect(bufferToHex(transferableOutput.toBytes())).toEqual(
    "0x6870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a0000000700000000ee5be5c000000000000000000000000100000001da2bee01be82ecc00c34f361eda8eb30fb5a715c"
  );

  const transferableOutput2 = PChainTransferableOutput({
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
  expect(transferableOutput2.toJSON()).toEqual({
    assetId:
      "0x6870b7d66ac32540311379e5b5dbad28ec7eb8ddbfc8f4d67299ebb48475907a",
    output: {
      typeId: 7,
      amount: 3999000000n,
      locktime: 0n,
      threshold: 1,
      addresses: ["0xda2bee01be82ecc00c34f361eda8eb30fb5a715c"],
    },
  });
});
