import { secp256k1 } from "@avalabs/avalanchejs";
import { Hex } from "viem";
import { bufferToHex, hexToBuffer } from "../../utils/common.js";

/**
 * Converts a private key to an XP public key.
 *
 * @param privateKey - The private key to convert.
 * @returns The XP public key.
 */
export function privateKeyToXPPublicKey(privateKey: Hex): Hex {
  const key = secp256k1.getPublicKey(hexToBuffer(privateKey));
  return bufferToHex(key) as Hex;
}
