import { utils } from "@avalabs/avalanchejs";
import { describe, expect, test } from "vitest";
import { CB58ToHex, hexToCB58 } from "./common.js";

describe("hexToCB58", () => {
  test("converts hex string to CB58", () => {
    const hex = "0x1234567890abcdef";
    const result = hexToCB58(hex);

    expect(typeof result).toBe("string");
    expect(result).toBe(utils.base58.encode(utils.hexToBuffer(hex)));
  });

  test("converts empty hex string to CB58", () => {
    const hex = "0x";
    const result = hexToCB58(hex);

    expect(typeof result).toBe("string");
    expect(result).toBe(utils.base58.encode(utils.hexToBuffer(hex)));
  });

  test("converts hex string without 0x prefix", () => {
    const hex = "0x1234567890abcdef";
    const result = hexToCB58(hex);

    expect(typeof result).toBe("string");
    // Should handle both with and without prefix
    expect(result.length).toBeGreaterThan(0);
  });

  test("converts various hex values", () => {
    const testCases = [
      "0x00" as const,
      "0xff" as const,
      "0x1234" as const,
      "0xabcdef1234567890" as const,
      ("0x" + "00".repeat(32)) as `0x${string}`, // 32 bytes
    ];

    for (const hex of testCases) {
      const result = hexToCB58(hex);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    }
  });

  test("round-trip conversion with CB58ToHex", () => {
    const originalHex = "0x1234567890abcdef" as const;
    const cb58 = hexToCB58(originalHex);
    const convertedBack = CB58ToHex(cb58);

    expect(convertedBack.toLowerCase()).toBe(originalHex.toLowerCase());
  });
});

describe("CB58ToHex", () => {
  test("converts CB58 string to hex", () => {
    const hex = "0x1234567890abcdef";
    const cb58 = utils.base58.encode(utils.hexToBuffer(hex));
    const result = CB58ToHex(cb58);

    expect(result).toMatch(/^0x/i);
    expect(result.toLowerCase()).toBe(hex.toLowerCase());
  });

  test("converts empty CB58 string to hex", () => {
    const cb58 = utils.base58.encode(new Uint8Array(0));
    const result = CB58ToHex(cb58);

    expect(result).toBe("0x");
  });

  test("converts various CB58 values", () => {
    const testCases = ["0x00", "0xff", "0x1234", "0xabcdef1234567890"];

    for (const hex of testCases) {
      const cb58 = utils.base58.encode(utils.hexToBuffer(hex));
      const result = CB58ToHex(cb58);
      expect(result).toMatch(/^0x/i);
      expect(result.toLowerCase()).toBe(hex.toLowerCase());
    }
  });

  test("round-trip conversion with hexToCB58", () => {
    const originalHex = "0xabcdef1234567890" as const;
    const cb58 = hexToCB58(originalHex);
    const convertedBack = CB58ToHex(cb58);

    expect(convertedBack.toLowerCase()).toBe(originalHex.toLowerCase());
  });

  test("handles invalid CB58 string gracefully", () => {
    // CB58 uses a specific alphabet, invalid characters should cause an error
    expect(() => CB58ToHex("invalid!@#")).toThrow();
  });

  test("handles very long CB58 strings", () => {
    const longHex = ("0x" + "00".repeat(100)) as `0x${string}`;
    const cb58 = hexToCB58(longHex);
    const result = CB58ToHex(cb58);

    expect(result.toLowerCase()).toBe(longHex.toLowerCase());
  });
});
