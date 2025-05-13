import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, concatBytes, hexToBytes } from "@noble/hashes/utils";
import { base58 } from "@scure/base";
import { add0x, strip0x } from "micro-eth-signer/utils";
import { Int } from "../types/primitives/int";
/**
 * Encodes a hex string (0x...) into CB58.
 *
 * @param hex - The hex string to encode.
 * @returns The CB58 encoded string.
 */
export function hexToCB58(hex: string): string {
  if (!hex.startsWith("0x")) throw new Error("Hex must start with 0x");
  const data = Uint8Array.from(Buffer.from(hex.slice(2), "hex"));

  const checksum = sha256(sha256(data)).slice(0, 4);
  const dataWithChecksum = concatBytes(data, checksum);
  return base58.encode(dataWithChecksum);
}

/**
 * Decodes a CB58 string into a hex string (0x...).
 *
 * @param cb58 - The CB58 string to decode.
 * @returns The hex string.
 */
export function CB58ToHex(cb58: string): string {
  const full = base58.decode(cb58);
  if (full.length < 5) throw new Error("Invalid CB58: too short");

  const data = full.slice(0, -4);
  const checksum = full.slice(-4);
  const expectedChecksum = sha256(sha256(data)).slice(0, 4);

  for (let i = 0; i < 4; i++) {
    if (checksum[i] !== expectedChecksum[i]) {
      throw new Error("Invalid CB58 checksum");
    }
  }

  return "0x" + Buffer.from(data).toString("hex");
}

/**
 * Converts a Uint8Array to a BigInt.
 *
 * @param buf - The Uint8Array to convert.
 * @returns The BigInt representation of the Uint8Array.
 */
export function bufferToBigInt(buf: Uint8Array) {
  return BigInt(bufferToHex(buf));
}

/**
 * Converts a Uint8Array to a number.
 *
 * @param buf - The Uint8Array to convert.
 * @returns The number representation of the Uint8Array.
 */
export function bufferToNumber(buf: Uint8Array) {
  return Number.parseInt(bytesToHex(buf), 16);
}

/**
 * Converts a Uint8Array to a hex string.
 *
 * @param buf - The Uint8Array to convert.
 * @returns The hex string representation of the Uint8Array.
 */
export function bufferToHex(buf: Uint8Array) {
  return add0x(bytesToHex(buf));
}

/**
 * Converts a hex string to a Uint8Array.
 *
 * @param hex - The hex string to convert.
 * @returns The Uint8Array representation of the hex string.
 */
export function hexToBuffer(hex: string) {
  hex = strip0x(hex);
  if (hex.length & 1) {
    hex = "0" + hex;
  }
  return hexToBytes(hex);
}

/**
 * Pads a Uint8Array with leading zeros to a specified length.
 *
 * @param bytes - The Uint8Array to pad.
 * @param length - The desired length of the padded Uint8Array.
 * @returns The padded Uint8Array.
 */
export function padLeft(bytes: Uint8Array, length: number) {
  const offset = length - bytes.length;

  if (offset <= 0) {
    return bytes;
  }

  const out = new Uint8Array(length);
  out.set(bytes, offset);
  return out;
}

/**
 * Calculates the number of `1`s (set bits) in the binary
 * representation a big-endian byte slice.
 *
 * @param input A Uint8Array
 * @returns The number of bits set to 1 in the binary representation of the input
 *
 * @example
 * ```ts
 * hammingWeight(new Uint8Array([0, 1, 2, 3, 4, 5])); // 7
 * ```
 */
export const hammingWeight = (input: Uint8Array): number => {
  let count = 0;

  for (let i = 0; i < input.length; i++) {
    let num = input[i];
    while (num !== 0) {
      count += num! & 1;
      num! >>= 1;
    }
  }

  return count;
};

/**
 * Adds a checksum to a Uint8Array.
 *
 * @param data - The Uint8Array to add the checksum to.
 * @returns The Uint8Array with the checksum added.
 */
export function addChecksum(data: Uint8Array) {
  return concatBytes(data, sha256(data).subarray(-4));
}

export function removeTypeIdFromBytes(bytes: Uint8Array) {
  return bytes.slice(4, bytes.length);
}

export function addTypeIdToBytes(bytes: Uint8Array, typeId: number) {
  return concatBytes(Int(typeId).toBytes(), bytes);
}
