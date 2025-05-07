import { sha256 } from "@noble/hashes/sha2.js";
import { base58 } from "@scure/base";
import { concatBytes } from "./buffer.js";

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
