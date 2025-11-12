import { describe, expect, test } from "vitest";

import { privateKey1ForTest } from "../../methods/wallet/fixtures/transactions/common.js";
import { privateKeyToXPPublicKey } from "./privateKeyToXPPublicKey.js";
import { publicKeyToXPAddress } from "./publicKeyToXPAddress.js";

const publicKey = privateKeyToXPPublicKey(privateKey1ForTest);

test("public key to XP address", () => {
  const address = publicKeyToXPAddress(publicKey, "avax");
  expect(address).toBeDefined();
  expect(typeof address).toBe("string");
  expect(address).toMatch("avax19fc97zn3mzmwr827j4d3n45refkksgmsekwmwa");
});

test("default hrp", () => {
  const address = publicKeyToXPAddress(publicKey, "avax");
  expect(address).toBeDefined();
  expect(typeof address).toBe("string");
  expect(address).toMatch(/^avax/);
});

test("fuji hrp", () => {
  const address = publicKeyToXPAddress(publicKey, "fuji");
  expect(address).toBeDefined();
  expect(address).toMatch(/^fuji/);
});

test("custom hrp", () => {
  const address = publicKeyToXPAddress(publicKey, "custom");
  expect(address).toBeDefined();
  expect(address).toMatch(/^custom/);
});

describe("deterministic addresses", () => {
  test("same public key produces same address", () => {
    const address1 = publicKeyToXPAddress(publicKey, "avax");
    const address2 = publicKeyToXPAddress(publicKey, "avax");
    expect(address1).toBe(address2);
  });

  test("different hrp produces different addresses", () => {
    const address1 = publicKeyToXPAddress(publicKey, "avax");
    const address2 = publicKeyToXPAddress(publicKey, "fuji");
    expect(address1).not.toBe(address2);
  });
});
