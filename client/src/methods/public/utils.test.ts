import { describe, expect, test } from "vitest";
import {
  computeDerivedID,
  encodeVariant,
  marshalConvertSubnetToL1TxDataJustification,
  marshalRegisterL1ValidatorMessageJustification,
  uint32ToBigEndianBytes,
} from "./utils.js";

describe("encodeVariant", () => {
  test("should encode 0", () => {
    const result = encodeVariant(0);
    expect(result).toEqual(new Uint8Array([0]));
  });

  test("should encode single-byte values (< 0x80)", () => {
    expect(encodeVariant(1)).toEqual(new Uint8Array([1]));
    expect(encodeVariant(127)).toEqual(new Uint8Array([0x7f]));
    expect(encodeVariant(64)).toEqual(new Uint8Array([0x40]));
  });

  test("should encode two-byte values (>= 0x80)", () => {
    const result128 = encodeVariant(128);
    expect(result128.length).toBe(2);
    expect(result128[0]).toBe(0x80);
    expect(result128[1]).toBe(0x01);

    const result255 = encodeVariant(255);
    expect(result255.length).toBe(2);
    expect(result255[0]).toBe(0xff);
    expect(result255[1]).toBe(0x01);
  });

  test("should encode three-byte values", () => {
    const result = encodeVariant(0x4000);
    expect(result.length).toBe(3);
    expect(result[0]).toBe(0x80);
    expect(result[1]).toBe(0x80);
    expect(result[2]).toBe(0x01);
  });

  test("should encode large values requiring multiple bytes", () => {
    const result = encodeVariant(0x1fffff);
    expect(result.length).toBe(3);
    expect(result[0]).toBe(0xff);
    expect(result[1]).toBe(0xff);
    expect(result[2]).toBe(0x7f);
  });

  test("should encode boundary value 0x7F (single byte)", () => {
    const result = encodeVariant(0x7f);
    expect(result).toEqual(new Uint8Array([0x7f]));
  });

  test("should encode boundary value 0x80 (two bytes)", () => {
    const result = encodeVariant(0x80);
    expect(result.length).toBe(2);
    expect(result[0]).toBe(0x80);
    expect(result[1]).toBe(0x01);
  });

  test("should encode maximum safe integer values", () => {
    const result = encodeVariant(Number.MAX_SAFE_INTEGER);
    expect(result.length).toBeGreaterThan(1);
    // Verify it's a valid varint encoding
    expect(result[result.length - 1] & 0x80).toBe(0); // Last byte should not have continuation bit
  });

  test("should encode various intermediate values", () => {
    expect(encodeVariant(300)).toEqual(new Uint8Array([0xac, 0x02]));
    expect(encodeVariant(150)).toEqual(new Uint8Array([0x96, 0x01]));
    expect(encodeVariant(1000)).toEqual(new Uint8Array([0xe8, 0x07]));
  });
});

describe("uint32ToBigEndianBytes", () => {
  test("should convert 0 to 4 zero bytes", () => {
    const result = uint32ToBigEndianBytes(0);
    expect(result).toEqual(new Uint8Array([0, 0, 0, 0]));
    expect(result.length).toBe(4);
  });

  test("should convert 1 to correct big-endian format", () => {
    const result = uint32ToBigEndianBytes(1);
    expect(result).toEqual(new Uint8Array([0, 0, 0, 1]));
  });

  test("should convert 255 to correct big-endian format", () => {
    const result = uint32ToBigEndianBytes(255);
    expect(result).toEqual(new Uint8Array([0, 0, 0, 0xff]));
  });

  test("should convert 256 to correct big-endian format", () => {
    const result = uint32ToBigEndianBytes(256);
    expect(result).toEqual(new Uint8Array([0, 0, 1, 0]));
  });

  test("should convert 65535 to correct big-endian format", () => {
    const result = uint32ToBigEndianBytes(65535);
    expect(result).toEqual(new Uint8Array([0, 0, 0xff, 0xff]));
  });

  test("should convert 65536 to correct big-endian format", () => {
    const result = uint32ToBigEndianBytes(65536);
    expect(result).toEqual(new Uint8Array([0, 1, 0, 0]));
  });

  test("should convert maximum uint32 value", () => {
    const result = uint32ToBigEndianBytes(0xffffffff);
    expect(result).toEqual(new Uint8Array([0xff, 0xff, 0xff, 0xff]));
  });

  test("should convert various intermediate values", () => {
    expect(uint32ToBigEndianBytes(0x12345678)).toEqual(
      new Uint8Array([0x12, 0x34, 0x56, 0x78])
    );
    expect(uint32ToBigEndianBytes(0xdeadbeef)).toEqual(
      new Uint8Array([0xde, 0xad, 0xbe, 0xef])
    );
  });

  test("should always return exactly 4 bytes", () => {
    expect(uint32ToBigEndianBytes(0).length).toBe(4);
    expect(uint32ToBigEndianBytes(1).length).toBe(4);
    expect(uint32ToBigEndianBytes(0xffffffff).length).toBe(4);
    expect(uint32ToBigEndianBytes(123456789).length).toBe(4);
  });
});

describe("computeDerivedID", () => {
  test("should append index to empty baseIDBytes", () => {
    const baseIDBytes = new Uint8Array([]);
    const index = 5;
    const result = computeDerivedID(baseIDBytes, index);

    expect(result.length).toBe(4); // 0 + 4 bytes for index
    expect(result.slice(0, 0)).toEqual(new Uint8Array([]));
    expect(result.slice(0)).toEqual(uint32ToBigEndianBytes(index));
  });

  test("should append index 0 to baseIDBytes", () => {
    const baseIDBytes = new Uint8Array([1, 2, 3, 4, 5]);
    const index = 0;
    const result = computeDerivedID(baseIDBytes, index);

    expect(result.length).toBe(9); // 5 + 4 bytes
    expect(result.slice(0, 5)).toEqual(baseIDBytes);
    expect(result.slice(5)).toEqual(new Uint8Array([0, 0, 0, 0]));
  });

  test("should append index to baseIDBytes", () => {
    const baseIDBytes = new Uint8Array([0x12, 0x34, 0x56, 0x78]);
    const index = 42;
    const result = computeDerivedID(baseIDBytes, index);

    expect(result.length).toBe(8); // 4 + 4 bytes
    expect(result.slice(0, 4)).toEqual(baseIDBytes);
    expect(result.slice(4)).toEqual(uint32ToBigEndianBytes(index));
  });

  test("should handle large baseIDBytes", () => {
    const baseIDBytes = new Uint8Array(32).fill(0xaa);
    const index = 100;
    const result = computeDerivedID(baseIDBytes, index);

    expect(result.length).toBe(36); // 32 + 4 bytes
    expect(result.slice(0, 32)).toEqual(baseIDBytes);
    expect(result.slice(32)).toEqual(uint32ToBigEndianBytes(index));
  });

  test("should handle maximum index value", () => {
    const baseIDBytes = new Uint8Array([1, 2, 3]);
    const index = 0xffffffff;
    const result = computeDerivedID(baseIDBytes, index);

    expect(result.length).toBe(7); // 3 + 4 bytes
    expect(result.slice(0, 3)).toEqual(baseIDBytes);
    expect(result.slice(3)).toEqual(new Uint8Array([0xff, 0xff, 0xff, 0xff]));
  });

  test("should handle various index values", () => {
    const baseIDBytes = new Uint8Array([0xab, 0xcd, 0xef]);
    const indices = [1, 255, 256, 65535, 65536, 1000000];

    for (const index of indices) {
      const result = computeDerivedID(baseIDBytes, index);
      expect(result.length).toBe(7); // 3 + 4 bytes
      expect(result.slice(0, 3)).toEqual(baseIDBytes);
      expect(result.slice(3)).toEqual(uint32ToBigEndianBytes(index));
    }
  });

  test("should preserve baseIDBytes exactly", () => {
    const baseIDBytes = new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06]);
    const index = 123;
    const result = computeDerivedID(baseIDBytes, index);

    // Verify baseIDBytes is unchanged
    const basePart = result.slice(0, baseIDBytes.length);
    expect(basePart).toEqual(baseIDBytes);
    expect(basePart).not.toBe(baseIDBytes); // Should be a copy, not reference
  });
});

describe("marshalConvertSubnetToL1TxDataJustification", () => {
  test("should marshal with empty subnetIDBytes and index 0", () => {
    const subnetIDBytes = new Uint8Array([]);
    const index = 0;
    const result = marshalConvertSubnetToL1TxDataJustification(
      subnetIDBytes,
      index
    );

    // Structure: outerTag (1) + outerLen (varint) + innerMsgBytes
    // innerMsgBytes: subnetIdTag (1) + subnetIdLen (varint for 0) + subnetIDBytes (0) + indexTag (1) + indexVarint (varint for 0)
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toBe(0x0a); // Outer tag (field 1, wire type 2)
  });

  test("should marshal with small subnetIDBytes and index 0", () => {
    const subnetIDBytes = new Uint8Array([0x12, 0x34]);
    const index = 0;
    const result = marshalConvertSubnetToL1TxDataJustification(
      subnetIDBytes,
      index
    );

    expect(result[0]).toBe(0x0a); // Outer tag
    // Verify structure contains subnetIDBytes
    const resultStr = Array.from(result)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    expect(resultStr).toContain("1234"); // Should contain the subnet ID bytes
  });

  test("should marshal with subnetIDBytes and various indices", () => {
    const subnetIDBytes = new Uint8Array([0xab, 0xcd, 0xef, 0x01, 0x02]);
    const indices = [0, 1, 5, 100, 255, 1000];

    for (const index of indices) {
      const result = marshalConvertSubnetToL1TxDataJustification(
        subnetIDBytes,
        index
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toBe(0x0a); // Outer tag
      // Verify it contains the subnet ID bytes
      const containsSubnetID = Array.from(result).some(
        (_, i) =>
          i < result.length - 5 &&
          result[i] === 0xab &&
          result[i + 1] === 0xcd &&
          result[i + 2] === 0xef
      );
      expect(containsSubnetID).toBe(true);
    }
  });

  test("should marshal with large subnetIDBytes", () => {
    const subnetIDBytes = new Uint8Array(32).fill(0xaa);
    const index = 42;
    const result = marshalConvertSubnetToL1TxDataJustification(
      subnetIDBytes,
      index
    );

    expect(result.length).toBeGreaterThan(32); // Should be larger than just subnetIDBytes
    expect(result[0]).toBe(0x0a); // Outer tag
  });

  test("should have correct protobuf structure", () => {
    const subnetIDBytes = new Uint8Array([0x01, 0x02, 0x03]);
    const index = 5;
    const result = marshalConvertSubnetToL1TxDataJustification(
      subnetIDBytes,
      index
    );

    // Verify outer structure: tag (0x0a) + length varint
    expect(result[0]).toBe(0x0a);
    // The length varint should follow
    expect(result.length).toBeGreaterThan(1);

    // Verify inner structure should contain:
    // - subnetIdTag (0x0a) at some position
    // - subnetIDBytes ([0x01, 0x02, 0x03])
    // - indexTag (0x10)
    // - indexVarint (5 encoded as varint)

    // Find subnet ID bytes in the result
    const subnetIDFound = Array.from(result).some(
      (_, i) =>
        i + 2 < result.length &&
        result[i] === 0x01 &&
        result[i + 1] === 0x02 &&
        result[i + 2] === 0x03
    );
    expect(subnetIDFound).toBe(true);
  });

  test("should handle maximum index value", () => {
    const subnetIDBytes = new Uint8Array([0xff, 0xee, 0xdd]);
    const index = 0xffffffff;
    const result = marshalConvertSubnetToL1TxDataJustification(
      subnetIDBytes,
      index
    );

    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toBe(0x0a); // Outer tag
  });

  test("should produce different results for different indices", () => {
    const subnetIDBytes = new Uint8Array([0x11, 0x22, 0x33]);
    const result1 = marshalConvertSubnetToL1TxDataJustification(
      subnetIDBytes,
      0
    );
    const result2 = marshalConvertSubnetToL1TxDataJustification(
      subnetIDBytes,
      1
    );
    const result3 = marshalConvertSubnetToL1TxDataJustification(
      subnetIDBytes,
      100
    );

    // Results should be different
    expect(result1).not.toEqual(result2);
    expect(result2).not.toEqual(result3);
    expect(result1).not.toEqual(result3);
  });

  test("should produce different results for different subnetIDs", () => {
    const subnetIDBytes1 = new Uint8Array([0x11, 0x22]);
    const subnetIDBytes2 = new Uint8Array([0x33, 0x44]);
    const index = 5;

    const result1 = marshalConvertSubnetToL1TxDataJustification(
      subnetIDBytes1,
      index
    );
    const result2 = marshalConvertSubnetToL1TxDataJustification(
      subnetIDBytes2,
      index
    );

    expect(result1).not.toEqual(result2);
  });
});

describe("marshalRegisterL1ValidatorMessageJustification", () => {
  test("should marshal empty payload", () => {
    const payloadBytes = new Uint8Array([]);
    const result = marshalRegisterL1ValidatorMessageJustification(payloadBytes);

    expect(result.length).toBe(2); // tag (1) + length varint for 0 (1)
    expect(result[0]).toBe(0x12); // Field 2, wire type 2
    expect(result[1]).toBe(0x00); // Length varint for 0
  });

  test("should marshal small payload", () => {
    const payloadBytes = new Uint8Array([0x01, 0x02, 0x03]);
    const result = marshalRegisterL1ValidatorMessageJustification(payloadBytes);

    expect(result.length).toBe(5); // tag (1) + length varint (1) + payload (3)
    expect(result[0]).toBe(0x12); // Field 2, wire type 2
    expect(result[1]).toBe(0x03); // Length varint for 3
    expect(result[2]).toBe(0x01);
    expect(result[3]).toBe(0x02);
    expect(result[4]).toBe(0x03);
    expect(result.slice(2)).toEqual(payloadBytes);
  });

  test("should marshal single byte payload", () => {
    const payloadBytes = new Uint8Array([0xff]);
    const result = marshalRegisterL1ValidatorMessageJustification(payloadBytes);

    expect(result.length).toBe(3); // tag (1) + length varint (1) + payload (1)
    expect(result[0]).toBe(0x12);
    expect(result[1]).toBe(0x01); // Length varint for 1
    expect(result[2]).toBe(0xff);
  });

  test("should marshal payload requiring multi-byte length varint", () => {
    // Create a payload that requires 2-byte length varint (>= 128 bytes)
    const payloadBytes = new Uint8Array(200).fill(0xaa);
    const result = marshalRegisterL1ValidatorMessageJustification(payloadBytes);

    const lengthVarint = encodeVariant(200);
    expect(result.length).toBe(1 + lengthVarint.length + 200); // tag (1) + length varint + payload (200)
    expect(result[0]).toBe(0x12); // Field 2, wire type 2
    // Length varint for 200 should be 2 bytes: [0xc8, 0x01]
    expect(result.slice(1, 1 + lengthVarint.length)).toEqual(lengthVarint);
    expect(result.slice(1 + lengthVarint.length)).toEqual(payloadBytes);
  });

  test("should marshal large payload", () => {
    const payloadBytes = new Uint8Array(1000).fill(0xbb);
    const result = marshalRegisterL1ValidatorMessageJustification(payloadBytes);

    const lengthVarint = encodeVariant(1000);
    expect(result.length).toBe(1 + lengthVarint.length + 1000); // tag (1) + length varint + payload (1000)
    expect(result[0]).toBe(0x12);
    expect(result.slice(1 + lengthVarint.length)).toEqual(payloadBytes);
  });

  test("should preserve payload bytes exactly", () => {
    const payloadBytes = new Uint8Array([
      0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0,
    ]);
    const result = marshalRegisterL1ValidatorMessageJustification(payloadBytes);

    const payloadStart = 1 + encodeVariant(payloadBytes.length).length;
    const extractedPayload = result.slice(payloadStart);
    expect(extractedPayload).toEqual(payloadBytes);
  });

  test("should handle payload with specific pattern", () => {
    const payloadBytes = new Uint8Array([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,
    ]);
    const result = marshalRegisterL1ValidatorMessageJustification(payloadBytes);

    expect(result[0]).toBe(0x12);
    const lengthVarint = encodeVariant(payloadBytes.length);
    expect(result.slice(1, 1 + lengthVarint.length)).toEqual(lengthVarint);
    expect(result.slice(1 + lengthVarint.length)).toEqual(payloadBytes);
  });

  test("should handle boundary payload sizes", () => {
    // Test payload sizes that trigger different length varint encodings
    const sizes = [127, 128, 255, 256, 16383, 16384];

    for (const size of sizes) {
      const payloadBytes = new Uint8Array(size).fill(0x42);
      const result =
        marshalRegisterL1ValidatorMessageJustification(payloadBytes);

      expect(result[0]).toBe(0x12); // Always starts with tag
      const lengthVarint = encodeVariant(size);
      expect(result.slice(1, 1 + lengthVarint.length)).toEqual(lengthVarint);
      expect(result.slice(1 + lengthVarint.length)).toEqual(payloadBytes);
      expect(result.length).toBe(1 + lengthVarint.length + size);
    }
  });

  test("should produce different results for different payloads", () => {
    const payload1 = new Uint8Array([0x01, 0x02]);
    const payload2 = new Uint8Array([0x03, 0x04]);
    const payload3 = new Uint8Array([0x01, 0x02, 0x03]);

    const result1 = marshalRegisterL1ValidatorMessageJustification(payload1);
    const result2 = marshalRegisterL1ValidatorMessageJustification(payload2);
    const result3 = marshalRegisterL1ValidatorMessageJustification(payload3);

    expect(result1).not.toEqual(result2);
    expect(result2).not.toEqual(result3);
    expect(result1).not.toEqual(result3);
  });

  test("should handle payload with all zero bytes", () => {
    const payloadBytes = new Uint8Array(10).fill(0);
    const result = marshalRegisterL1ValidatorMessageJustification(payloadBytes);

    expect(result[0]).toBe(0x12);
    expect(result[1]).toBe(0x0a); // Length varint for 10
    expect(result.slice(2)).toEqual(payloadBytes);
  });

  test("should handle payload with all 0xFF bytes", () => {
    const payloadBytes = new Uint8Array(5).fill(0xff);
    const result = marshalRegisterL1ValidatorMessageJustification(payloadBytes);

    expect(result[0]).toBe(0x12);
    expect(result[1]).toBe(0x05); // Length varint for 5
    expect(result.slice(2)).toEqual(payloadBytes);
  });
});
