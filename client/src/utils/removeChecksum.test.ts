import { sha256 } from "@noble/hashes/sha256";
import { describe, expect, test } from "vitest";
import { removeChecksum } from "./removeChecksum.js";

describe("removeChecksum", () => {
  test("removes checksum from valid data", () => {
    const data = new Uint8Array([1, 2, 3, 4, 5]);
    const checksum = sha256(data).subarray(-4);
    const dataWithChecksum = new Uint8Array([...data, ...checksum]);

    const result = removeChecksum(dataWithChecksum);

    expect(result).toEqual(data);
    expect(result.length).toBe(5);
  });

  test("removes checksum from larger data", () => {
    const data = new Uint8Array(100).fill(42);
    const checksum = sha256(data).subarray(-4);
    const dataWithChecksum = new Uint8Array([...data, ...checksum]);

    const result = removeChecksum(dataWithChecksum);

    expect(result).toEqual(data);
    expect(result.length).toBe(100);
  });

  test("removes checksum from empty data", () => {
    const data = new Uint8Array(0);
    const checksum = sha256(data).subarray(-4);
    const dataWithChecksum = new Uint8Array([...data, ...checksum]);

    const result = removeChecksum(dataWithChecksum);

    expect(result).toEqual(data);
    expect(result.length).toBe(0);
  });

  test("throws error when data is too short", () => {
    const shortData = new Uint8Array([1, 2, 3]);

    expect(() => removeChecksum(shortData)).toThrow(
      "Data too short — no checksum present"
    );
  });

  test("throws error when data is exactly 3 bytes", () => {
    const shortData = new Uint8Array([1, 2, 3]);

    expect(() => removeChecksum(shortData)).toThrow(
      "Data too short — no checksum present"
    );
  });

  test("throws error when checksum is invalid", () => {
    const data = new Uint8Array([1, 2, 3, 4, 5]);
    const invalidChecksum = new Uint8Array([0, 0, 0, 0]);
    const dataWithInvalidChecksum = new Uint8Array([
      ...data,
      ...invalidChecksum,
    ]);

    expect(() => removeChecksum(dataWithInvalidChecksum)).toThrow(
      "Invalid checksum"
    );
  });

  test("throws error when checksum is partially invalid", () => {
    const data = new Uint8Array([1, 2, 3, 4, 5]);
    const validChecksum = sha256(data).subarray(-4);
    // Modify one byte of the checksum
    validChecksum[0] = (validChecksum[0] + 1) % 256;
    const dataWithInvalidChecksum = new Uint8Array([...data, ...validChecksum]);

    expect(() => removeChecksum(dataWithInvalidChecksum)).toThrow(
      "Invalid checksum"
    );
  });

  test("handles data with minimum valid length (4 bytes)", () => {
    const data = new Uint8Array([42]);
    const checksum = sha256(data).subarray(-4);
    const dataWithChecksum = new Uint8Array([...data, ...checksum]);

    const result = removeChecksum(dataWithChecksum);

    expect(result).toEqual(data);
    expect(result.length).toBe(1);
  });
});
