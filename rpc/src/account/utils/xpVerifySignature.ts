import { secp256k1, utils } from "@avalabs/avalanchejs";
import { Hex } from "viem";

/**
 * Verify a signature using the secp256k1 curve
 * @param message - The message to verify
 * @param signature - The signature to verify
 * @param publicKey - The public key to verify the signature against
 * @returns true if the signature is valid, false otherwise
 */
export function xpVerifySignature(
  message: Hex | Uint8Array,
  signature: Hex | Uint8Array,
  publicKey: Hex | Uint8Array
): boolean {
  return secp256k1.verify(
    typeof message === "string" ? utils.hexToBuffer(message) : message,
    signature,
    typeof publicKey === "string" ? utils.hexToBuffer(publicKey) : publicKey
  );
}
