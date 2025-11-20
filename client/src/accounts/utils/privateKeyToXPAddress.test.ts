import { describe, expect, test } from "vitest";

import { privateKey1ForTest } from "../../methods/wallet/fixtures/transactions/common.js";
import { privateKeyToXPAddress } from "./privateKeyToXPAddress.js";

test("default hrp", () => {
  const address = privateKeyToXPAddress(privateKey1ForTest, "avax");
  expect(address).toBeDefined();
  expect(typeof address).toBe("string");
  expect(address).toMatch(/^avax/);
  expect(address).toMatch("avax19fc97zn3mzmwr827j4d3n45refkksgmsekwmwa");
});

test("fuji hrp", () => {
  const address = privateKeyToXPAddress(privateKey1ForTest, "fuji");
  expect(address).toBeDefined();
  expect(address).toMatch(/^fuji/);
});

test("custom hrp", () => {
  const address = privateKeyToXPAddress(privateKey1ForTest, "custom");
  expect(address).toBeDefined();
  expect(address).toMatch(/^custom/);
});

describe("deterministic addresses", () => {
  test("same private key produces same address", () => {
    const address1 = privateKeyToXPAddress(privateKey1ForTest, "avax");
    const address2 = privateKeyToXPAddress(privateKey1ForTest, "avax");
    expect(address1).toBe(address2);
  });

  test("different hrp produces different addresses", () => {
    const address1 = privateKeyToXPAddress(privateKey1ForTest, "avax");
    const address2 = privateKeyToXPAddress(privateKey1ForTest, "fuji");
    expect(address1).not.toBe(address2);
  });
});
