import { utils } from "@avalabs/avalanchejs";
import { Hex } from "viem";

/**
 * Encodes a hex string (0x...) into CB58.
 *
 * @param hex - The hex string to encode.
 * @returns The CB58 encoded string.
 */
export function hexToCB58(hex: Hex): string {
  return utils.base58.encode(utils.hexToBuffer(hex));
}

/**
 * Decodes a CB58 string into a hex string (0x...).
 *
 * @param cb58 - The CB58 string to decode.
 * @returns The hex string.
 */
export function CB58ToHex(cb58: string): Hex {
  return utils.bufferToHex(utils.base58.decode(cb58)) as Hex;
}
