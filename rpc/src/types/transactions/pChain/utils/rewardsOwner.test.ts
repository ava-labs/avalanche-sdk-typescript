import { expect, test } from "vitest";
import { bufferToHex, hexToBuffer } from "../../../../utils/common.js";
import { RewardsOwner } from "./rewardsOwner.js";

test("RewardsOwner", () => {
  // Example from documentation
  const testHex =
    "0x0000000b000000000000d431000000010000000251025c61fbcfc078f69334f834be6dd26d55a955c3344128e060128ede3523a24a461c8943ab0859";

  const [rewardsOwner, rest] = RewardsOwner.fromBytes(hexToBuffer(testHex));

  expect(rewardsOwner.toJSON()).toEqual({
    typeId: 11,
    locktime: 54321n,
    threshold: 1,
    addresses: [
      "0x51025c61fbcfc078f69334f834be6dd26d55a955",
      "0xc3344128e060128ede3523a24a461c8943ab0859",
    ],
  });

  expect(rest.length).toEqual(0);
  expect(bufferToHex(rewardsOwner.toBytes())).toEqual(testHex);

  // Test creating from JSON
  const rewardsOwnerFromJson = RewardsOwner({
    typeId: 11,
    locktime: 54321n,
    threshold: 1,
    addresses: [
      "0x51025c61fbcfc078f69334f834be6dd26d55a955",
      "0xc3344128e060128ede3523a24a461c8943ab0859",
    ],
  });

  expect(rewardsOwnerFromJson.toJSON()).toEqual({
    typeId: 11,
    locktime: 54321n,
    threshold: 1,
    addresses: [
      "0x51025c61fbcfc078f69334f834be6dd26d55a955",
      "0xc3344128e060128ede3523a24a461c8943ab0859",
    ],
  });

  // Test validation errors
  expect(() =>
    RewardsOwner({
      typeId: 11,
      locktime: 54321n,
      threshold: 3, // Greater than number of addresses
      addresses: [
        "0x51025c61fbcfc078f69334f834be6dd26d55a955",
        "0xc3344128e060128ede3523a24a461c8943ab0859",
      ],
    })
  ).toThrow("Threshold must be less than or equal to the number of addresses");

  expect(() =>
    RewardsOwner({
      typeId: 11,
      locktime: 54321n,
      threshold: 1, // Non-zero threshold with no addresses
      addresses: [],
    })
  ).toThrow("Threshold must be 0 when there are no addresses");
});
