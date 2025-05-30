import { secp256k1, utils } from "@avalabs/avalanchejs";

import { Hex } from "viem";

/**
 * Signs a transaction hash with an XP private key.
 *
 * @param txHash - The transaction hash to sign.
 * @param privateKey - The private key to sign with.
 * @returns The signature.
 */
export async function xpSignTransaction(
  txHash: Hex | Uint8Array,
  privateKey: Hex | Uint8Array
): Promise<Hex> {
  const sig = await secp256k1.sign(
    typeof txHash === "string" ? utils.hexToBuffer(txHash) : txHash,
    typeof privateKey === "string" ? utils.hexToBuffer(privateKey) : privateKey
  );
  return utils.bufferToHex(sig) as Hex;
}
