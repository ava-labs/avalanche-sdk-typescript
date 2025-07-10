import { secp256k1, utils } from "@avalabs/avalanchejs";
import { XPAddress } from "../avalancheAccount.js";

/**
 * Converts a public key to an XP address.
 *
 * @param publicKey - The public key to convert.
 * @param hrp - The human readable prefix to use for the address.
 * @returns The XP address as a `0x` prefixed string.
 *
 * @example
 * ```ts
 * import { publicKeyToXPAddress } from "@avalanche-sdk/client/accounts";
 *
 * const address = publicKeyToXPAddress("0xab....", "avax");
 * console.log(address);
 * ```
 */
export function publicKeyToXPAddress(
  publicKey: string,
  hrp: string
): XPAddress {
  const address = secp256k1.publicKeyBytesToAddress(
    utils.hexToBuffer(publicKey)
  );
  return utils.formatBech32(hrp, address) as XPAddress;
}
