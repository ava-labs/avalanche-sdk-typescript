import { XPAddress } from "../avalancheAccount.js";
import { privateKeyToXPPublicKey } from "./privateKeyToXPPublicKey.js";
import { publicKeyToXPAddress } from "./publicKeyToXPAddress.js";

/**
 * Converts a private key to an XP address.
 *
 * @param privateKey - The private key to convert.
 * @param hrp - The human readable prefix to use for the address.
 * @returns The XP address as a `0x` prefixed string.
 *
 * @example
 * ```ts
 * import { privateKeyToXPAddress } from "@avalanche-sdk/client/accounts";
 *
 * const address = privateKeyToXPAddress("0xab....", "avax");
 * console.log(address);
 * ```
 */
export function privateKeyToXPAddress(
  privateKey: string,
  hrp: string
): XPAddress {
  const publicKey = privateKeyToXPPublicKey(privateKey);
  const address = publicKeyToXPAddress(publicKey, hrp);
  return address;
}
