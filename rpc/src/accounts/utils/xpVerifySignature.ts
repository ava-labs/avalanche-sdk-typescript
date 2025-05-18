import { secp256k1, utils } from "@avalabs/avalanchejs";
import { Hex } from "viem";

/**
 * Verifies a signature.
 *
 * @param signature - The signature to verify.
 * @param message - The message that was signed.
 * @param publicKey - The public key to verify with.
 * @returns Whether the signature is valid.
 */
export function xpVerifySignature(
  signature: Hex,
  message: string | Uint8Array,
  publicKey: Hex
): boolean {
  return secp256k1.verify(
    utils.hexToBuffer(signature),
    message,
    utils.hexToBuffer(publicKey)
  );
}
