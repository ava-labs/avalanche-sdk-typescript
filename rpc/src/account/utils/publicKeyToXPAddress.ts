import { secp256k1, utils } from "@avalabs/avalanchejs";
import { Hex } from "viem";
import { hexToBuffer } from "../../utils/common.js";
import { XPAddress } from "../avalancheAccount.js";

/**
 * Converts a public key to an XP address.
 *
 * @param publicKey - The public key to convert.
 * @returns The XP address.
 */
export function publicKeyToXPAddress(publicKey: Hex, hrp: string): XPAddress {
  return utils.formatBech32(
    hrp,
    secp256k1.publicKeyBytesToAddress(hexToBuffer(publicKey))
  );
}
