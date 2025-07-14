import { Hex } from "viem";
import { privateKeyToAccount, PrivateKeyToAccountOptions } from "viem/accounts";
import { AvalancheAccount } from "./avalancheAccount";
import { privateKeyToXPAccount } from "./privateKeyToXPAccount";

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
  };
}
