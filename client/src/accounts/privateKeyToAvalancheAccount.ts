import { Hex } from "viem";
import { privateKeyToAccount, PrivateKeyToAccountOptions } from "viem/accounts";
import { AvalancheAccount, XPAddress } from "./avalancheAccount.js";
import { privateKeyToXPAccount } from "./privateKeyToXPAccount.js";
import { privateKeyToXPAddress } from "./utils/privateKeyToXPAddress.js";

/**
 * Converts a private key to an Avalanche account.
 *
 * @param privateKey - The private key to convert with the `0x` prefix.
 * @param options - The options for the account. {@link PrivateKeyToAccountOptions}
 * @returns The Avalanche account {@link AvalancheAccount}.
 */
export function privateKeyToAvalancheAccount(
  privateKey: string,
  options: PrivateKeyToAccountOptions = {}
): AvalancheAccount {
  return {
    evmAccount: privateKeyToAccount(privateKey as Hex, options),
    xpAccount: privateKeyToXPAccount(privateKey),
    getXPAddress: (
      chain?: "X" | "P" | "C" | undefined,
      hrp: string = "avax"
    ): XPAddress => {
      if (chain) {
        return `${chain}-${privateKeyToXPAddress(privateKey, hrp)}`;
      }
      return privateKeyToXPAddress(privateKey, hrp);
    },
    getEVMAddress: () =>
      privateKeyToAccount(privateKey as Hex, options).address,
  };
}
