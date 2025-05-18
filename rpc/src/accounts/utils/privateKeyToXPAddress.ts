import { Hex } from "viem";
import { XPAddress } from "../avalancheAccount.js";
import { privateKeyToXPPublicKey } from "./privateKeyToXPPublicKey.js";
import { publicKeyToXPAddress } from "./publicKeyToXPAddress.js";

/**
 * @description Converts a private key to an XP address.
 *
 * @param privateKey - The private key to convert.
 * @param hrp - The human readable prefix to use for the address.
 * @returns The XP address.
 */
export function privateKeyToXPAddress(privateKey: Hex, hrp: string): XPAddress {
  const publicKey = privateKeyToXPPublicKey(privateKey);
  const address = publicKeyToXPAddress(publicKey, hrp);
  return address;
}
