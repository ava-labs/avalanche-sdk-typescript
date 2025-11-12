import { Int, secp256k1, utils } from "@avalabs/avalanchejs";
import { sha256 } from "@noble/hashes/sha256";
import { utf8ToBytes } from "@noble/hashes/utils";

/**
 * Signs a message with an XP private key.
 *
 * @param message - The message to sign.
 * @param privateKey - The private key to sign with.
 * @returns A promise that resolves to the signature as a `0x` prefixed string.
 */
export async function xpSignMessage(
  message: string,
  privateKey: string
): Promise<string> {
  const prefix = "Avalanche Signed Message:\n";
  const messageToHashBuffer = new Uint8Array([
    ...utils.hexToBuffer(prefix.length.toString(16)),
    ...utf8ToBytes(prefix),
    ...new Int(message.length).toBytes(),
    ...utf8ToBytes(message),
  ]);

  const sig = await secp256k1.signHash(
    sha256(messageToHashBuffer),
    utils.hexToBuffer(privateKey)
  );
  return utils.base58.encode(utils.addChecksum(utils.addChecksum(sig)));
}
