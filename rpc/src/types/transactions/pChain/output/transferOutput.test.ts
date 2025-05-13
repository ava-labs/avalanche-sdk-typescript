import { expect, test } from "vitest";
import { bufferToHex, hexToBuffer } from "../../../../utils/common";
import { PChainTransferOutput } from "./transferOutput";

test("PChainTransferOutput", () => {
  const [transferOutput, rest] = PChainTransferOutput.fromBytes(
    hexToBuffer(
      "0x0000000700000000ee5be5c000000000000000000000000100000001da2bee01be82ecc00c34f361eda8eb30fb5a715c"
    )
  );
  expect(transferOutput.toJSON()).toEqual({
    typeId: 7,
    amount: 3999000000n,
    locktime: 0n,
    threshold: 1,
    addresses: ["0xda2bee01be82ecc00c34f361eda8eb30fb5a715c"],
  });
  expect(rest.length).toEqual(0);
  expect(bufferToHex(transferOutput.toBytes())).toEqual(
    "0x0000000700000000ee5be5c000000000000000000000000100000001da2bee01be82ecc00c34f361eda8eb30fb5a715c"
  );
});
