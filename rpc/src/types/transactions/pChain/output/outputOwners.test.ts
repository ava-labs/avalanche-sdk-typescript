import { expect, test } from "vitest";
import { bufferToHex, hexToBuffer } from "../../../../utils/common";
import { PChainOutputOwners } from "./outputOwners";

test("PChainOutputOwners", () => {
  const [outputOwners, rest] = PChainOutputOwners.fromBytes(
    hexToBuffer(
      "0x0000000b00000000000000000000000100000001da2bee01be82ecc00c34f361eda8eb30fb5a715c"
    )
  );
  expect(outputOwners.toJSON()).toEqual({
    typeId: 11,
    locktime: 0n,
    threshold: 1,
    addresses: ["0xda2bee01be82ecc00c34f361eda8eb30fb5a715c"],
  });
  expect(rest.length).toEqual(0);
  expect(bufferToHex(outputOwners.toBytes())).toEqual(
    "0x0000000b00000000000000000000000100000001da2bee01be82ecc00c34f361eda8eb30fb5a715c"
  );
});

test("PChainOutputOwners custom", () => {
  const outputOwners = PChainOutputOwners({
    typeId: 11,
    locktime: 0,
    threshold: 1,
    addresses: ["0xda2bee01be82ecc00c34f361eda8eb30fb5a715c"],
  });

  expect(outputOwners.toJSON()).toEqual({
    typeId: 11,
    locktime: 0n,
    threshold: 1,
    addresses: ["0xda2bee01be82ecc00c34f361eda8eb30fb5a715c"],
  });
});
