import { Int, secp256k1, utils } from "@avalabs/avalanchejs";
import { utf8ToBytes } from "@noble/hashes/utils";
import { Hex } from "viem";

/**
 * Signs a message with an XP private key.
 *
 * @param message - The message to sign.
 * @param privateKey - The private key to sign with.
 * @returns The signature.
 */
export async function xpSignMessage(
  message: string,
  privateKey: Hex
): Promise<Hex> {
  const prefix = "Avalanche Signed Message:\n";
  const messageToHashBuffer = new Uint8Array([
    ...utils.hexToBuffer(prefix.length.toString(16)),
    ...utf8ToBytes(prefix),
    ...new Int(message.length).toBytes(),
    ...utf8ToBytes(message),
  ]);
  console.log(" sayan", messageToHashBuffer);
  const sig = await secp256k1.sign(
    messageToHashBuffer,
    utils.hexToBuffer(privateKey)
  );
  return utils.base58.encode(utils.addChecksum(utils.addChecksum(sig))) as Hex;
}
