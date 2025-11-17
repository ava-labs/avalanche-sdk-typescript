import { describe, expect, test } from "vitest";

import {
  privateKey1ForTest,
  privateKey2ForTest,
} from "../../methods/wallet/fixtures/transactions/common.js";
import { privateKeyToXPPublicKey } from "./privateKeyToXPPublicKey.js";

describe("privateKeyToXPPublicKey", () => {
  test("converts private key to public key", () => {
    const publicKey = privateKeyToXPPublicKey(privateKey1ForTest);
    const expectedPublicKey =
      "0x0245ae25e2903178ddc15a26bbaa05dc3c923aba8fb64d2443ea02d91589a22208"; // 0x + 66 hex characters for compressed public key
    expect(publicKey).toBe(expectedPublicKey);
    expect(typeof publicKey).toBe("string");
    expect(publicKey).toMatch(/^0x/);

    expect(publicKey.length).toBe(68);
  });

  test("produces deterministic public keys", () => {
    const publicKey1 = privateKeyToXPPublicKey(privateKey1ForTest);
    const publicKey2 = privateKeyToXPPublicKey(privateKey1ForTest);

    const expectedPublicKey =
      "0x0245ae25e2903178ddc15a26bbaa05dc3c923aba8fb64d2443ea02d91589a22208";
    expect(publicKey1).toBe(expectedPublicKey);
    expect(publicKey1).toBe(publicKey2);
  });

  test("different private keys produce different public keys", () => {
    const publicKey1 = privateKeyToXPPublicKey(privateKey1ForTest);
    const publicKey2 = privateKeyToXPPublicKey(privateKey2ForTest);

    expect(publicKey1).not.toBe(publicKey2);
  });

  test("public key format is correct", () => {
    const publicKey = privateKeyToXPPublicKey(privateKey1ForTest);
    const expectedPublicKey =
      "0x0245ae25e2903178ddc15a26bbaa05dc3c923aba8fb64d2443ea02d91589a22208";
    expect(publicKey).toBe(expectedPublicKey);
    expect(publicKey.startsWith("0x")).toBe(true);
    const hexPart = publicKey.slice(2);
    expect(hexPart.length).toBe(66);
  });

  test("handles different private keys", () => {
    const publicKey1 = privateKeyToXPPublicKey(privateKey1ForTest);
    const publicKey2 = privateKeyToXPPublicKey(privateKey2ForTest);
    const expectedPublicKey1 =
      "0x0245ae25e2903178ddc15a26bbaa05dc3c923aba8fb64d2443ea02d91589a22208";
    const expectedPublicKey2 =
      "0x0327448e78ffa8cdb24cf19be0204ad954b1bdb4db8c51183534c1eecf2ebd094e";

    expect(publicKey1).toBe(expectedPublicKey1);
    expect(publicKey2).toBe(expectedPublicKey2);

    expect(publicKey1).toBeDefined();
    expect(publicKey2).toBeDefined();
    expect(publicKey1).not.toBe(publicKey2);
    expect(publicKey1.length).toBe(publicKey2.length);
  });

  test("handles private key without 0x prefix", () => {
    const publicKey = privateKeyToXPPublicKey(privateKey1ForTest.slice(2));
    expect(publicKey).toBe(privateKeyToXPPublicKey(privateKey1ForTest));
  });

  describe("error cases", () => {
    test("throws error for invalid private key format", () => {
      expect(() => privateKeyToXPPublicKey("invalid")).toThrow();
    });

    test("throws error for empty string", () => {
      expect(() => privateKeyToXPPublicKey("")).toThrow();
    });

    test("throws error for too short private key", () => {
      expect(() => privateKeyToXPPublicKey("0x1234")).toThrow();
    });

    test("throws error for invalid hex characters", () => {
      expect(() => privateKeyToXPPublicKey("0xgggggggg")).toThrow();
    });
  });
});
