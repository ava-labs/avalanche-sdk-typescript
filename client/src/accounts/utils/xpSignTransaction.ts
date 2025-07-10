import { secp256k1, utils } from "@avalabs/avalanchejs";

/**
 * Signs a transaction hash with an XP private key.
 *
 * @param txHash - The transaction hash to sign.
 * @param privateKey - The private key to sign with.
 * @returns A promise that resolves to the signature as a `0x` prefixed string.
 */
export async function xpSignTransaction(
  txHash: string | Uint8Array,
  privateKey: string | Uint8Array
): Promise<string> {
  const sig = await secp256k1.sign(
    typeof txHash === "string" ? utils.hexToBuffer(txHash) : txHash,
    typeof privateKey === "string" ? utils.hexToBuffer(privateKey) : privateKey
  );
  return utils.bufferToHex(sig);
}
