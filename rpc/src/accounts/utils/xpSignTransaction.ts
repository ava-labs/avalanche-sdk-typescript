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
  txHash: Hex,
  privateKey: Hex
): Promise<Hex> {
  const sig = await secp256k1.signHash(
    utils.hexToBuffer(txHash),
    utils.hexToBuffer(privateKey)
  );
  return utils.bufferToHex(sig) as Hex;
}
