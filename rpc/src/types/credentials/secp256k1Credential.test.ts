import { expect, test } from "vitest";
import { bufferToHex, hexToBuffer } from "../../utils/common.js";
import { SECP256K1Credential } from "./secp256k1Credential.js";

test("SECP256K1Credential", () => {
  // Example hex from documentation
  const testHex =
    "0x0000000900000002000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1e1d1f202122232425262728292a2b2c2e2d2f303132333435363738393a3b3c3d3e3f00404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5e5d5f606162636465666768696a6b6c6e6d6f707172737475767778797a7b7c7d7e7f00";

  const [credential, rest] = SECP256K1Credential.fromBytes(
    hexToBuffer(testHex)
  );

  expect(credential.toJSON()).toEqual({
    typeId: 9,
    signatures: [
      "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1e1d1f202122232425262728292a2b2c2e2d2f303132333435363738393a3b3c3d3e3f00",
      "0x404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5e5d5f606162636465666768696a6b6c6e6d6f707172737475767778797a7b7c7d7e7f00",
    ],
  });

  expect(rest.length).toEqual(0);
  expect(bufferToHex(credential.toBytes())).toEqual(testHex);
});
