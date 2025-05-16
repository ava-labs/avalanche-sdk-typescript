import { secp256k1, utils } from "@avalabs/avalanchejs";
import { Hex } from "viem";

/**
 * Recover the public key from a message and signature
 * @param message - The message to recover the public key from
 * @param signature - The signature to recover the public key from
 * @param to - The format of the public key to return
 * @returns The public key in the specified format
 */
export function xpRecoverPublicKey(
  message: Hex | Uint8Array,
  signature: Hex | Uint8Array,
  to: "hex" | "bytes" = "bytes"
): Hex | Uint8Array {
  const publicKey = secp256k1.recoverPublicKey(
    message,
    typeof signature === "string" ? utils.hexToBuffer(signature) : signature
  );
  return to === "hex" ? (utils.bufferToHex(publicKey) as Hex) : publicKey;
}
