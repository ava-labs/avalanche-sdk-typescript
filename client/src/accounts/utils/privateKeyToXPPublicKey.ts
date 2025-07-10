import { secp256k1, utils } from "@avalabs/avalanchejs";

/**
 * Converts a private key to an XP public key.
 *
 * @param privateKey - The private key to convert.
 * @returns The XP public key as a `0x` prefixed string.
 *
 * @example
 * ```ts
 * import { privateKeyToXPPublicKey } from "@avalanche-sdk/client/accounts";
 *
 * const publicKey = privateKeyToXPPublicKey("0xab....");
 * console.log(publicKey);
 * ```
 */
export function privateKeyToXPPublicKey(privateKey: string): string {
  const key = secp256k1.getPublicKey(utils.hexToBuffer(privateKey));
  return utils.bufferToHex(key);
}
