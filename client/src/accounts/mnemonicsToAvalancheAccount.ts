import { HDKey } from "@scure/bip32";
import { mnemonicToSeedSync } from "@scure/bip39";
import { MnemonicToAccountOptions } from "viem/accounts";
import { AvalancheAccount } from "./avalancheAccount.js";
import { hdKeyToAvalancheAccount } from "./hdKeyToAvalancheAccount.js";

/**
 * Converts a mnemonic to an Avalanche account.
 *
 * @param mnemonics - The mnemonic to convert.
 * @param options - The options for the account. {@link MnemonicToAccountOptions}
 * @returns The Avalanche account {@link AvalancheAccount}.
 *
 * @example
 * ```ts
 * import { mnemonicsToAvalancheAccount } from "@avalanche-sdk/client/accounts";
 *
 * const account = mnemonicsToAvalancheAccount("test test t..");
 */
export function mnemonicsToAvalancheAccount(
  mnemonics: string,
  options: MnemonicToAccountOptions = {}
): AvalancheAccount {
  const seed = mnemonicToSeedSync(mnemonics);
  return hdKeyToAvalancheAccount(HDKey.fromMasterSeed(seed), options);
}
