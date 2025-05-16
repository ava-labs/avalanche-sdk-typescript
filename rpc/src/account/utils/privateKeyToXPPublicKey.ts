import { secp256k1, utils } from "@avalabs/avalanchejs";
import { Hex } from "viem";

/**
 * Converts a private key to an XP public key.
 *
 * @param privateKey - The private key to convert.
 * @returns The XP public key.
 */
export function privateKeyToXPPublicKey(privateKey: Hex): Hex {
  const key = secp256k1.getPublicKey(utils.hexToBuffer(privateKey));
  return utils.bufferToHex(key) as Hex;
}
