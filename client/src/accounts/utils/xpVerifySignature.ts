import { Int, secp256k1, utils } from "@avalabs/avalanchejs";
import { sha256 } from "@noble/hashes/sha256";
import { utf8ToBytes } from "@noble/hashes/utils";

/**
 * Verifies a signature.
 *
 * @param signature - The signature to verify.
 * @param message - The message that was signed.
 * @param publicKey - The public key to verify with.
 * @returns A boolean indicating whether the signature is valid.
 */
export function xpVerifySignature(
  signature: string,
  message: string,
  publicKey: string
): boolean {
  const prefix = "Avalanche Signed Message:\n";
  const messageToHashBuffer = new Uint8Array([
    ...utils.hexToBuffer(prefix.length.toString(16)),
    ...utf8ToBytes(prefix),
    ...new Int(message.length).toBytes(),
    ...utf8ToBytes(message),
  ]);

  const hash = sha256(messageToHashBuffer);

  // Convert signature to buffer
  const sigBytes = utils.hexToBuffer(signature);
  return secp256k1.verify(sigBytes, hash, utils.hexToBuffer(publicKey));
}
