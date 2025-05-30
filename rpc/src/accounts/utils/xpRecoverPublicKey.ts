import { secp256k1, utils } from "@avalabs/avalanchejs";
import { Hex } from "viem";

/**
 * Recovers a public key from a signature and message.
 *
 * @param message - The message that was signed.
 * @param signature - The signature.
 * @returns The recovered public key.
 */
export function xpRecoverPublicKey(message: Hex, signature: Hex): Hex {
  const key = secp256k1.recoverPublicKey(
    utils.hexToBuffer(message),
    utils.hexToBuffer(signature)
  );
  return utils.bufferToHex(key) as Hex;
}
