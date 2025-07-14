import { secp256k1, utils } from "@avalabs/avalanchejs";

/**
 * Recovers a public key from a signature and message.
 *
 * @param message - The message that was signed.
 * @param signature - The signature.
 * @returns The recovered public key as a `0x` prefixed string.
 *
 * @example
 * ```ts
 * import { xpRecoverPublicKey } from "@avalanche-sdk/client/accounts";
 *
 * const publicKey = xpRecoverPublicKey("0xab....", "0xab....");
 * console.log(publicKey);
 * ```
 */
export function xpRecoverPublicKey(message: string, signature: string): string {
  const key = secp256k1.recoverPublicKey(
    utils.hexToBuffer(message),
    utils.hexToBuffer(signature)
  );
  return utils.bufferToHex(key);
}
