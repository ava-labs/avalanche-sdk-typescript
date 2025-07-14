import { HDKey } from "@scure/bip32";
import { mnemonicToSeedSync } from "@scure/bip39";
import { MnemonicToAccountOptions } from "viem/accounts";
import { AvalancheAccount } from "./avalancheAccount";
import { hdKeyToAvalancheAccount } from "./hdKeyToAvalancheAccount";

/**
 * Converts a mnemonic to an Avalanche account.
 *
 * @param memonics - The mnemonic to convert.
 * @param options - The options for the account. {@link MnemonicToAccountOptions}
 * @returns The Avalanche account {@link AvalancheAccount}.
 *
 * @example
 * ```ts
 * import { memonicsToAvalancheAccount } from "@avalanche-sdk/client/accounts";
 *
 * const account = memonicsToAvalancheAccount("test test t..");
 */
export function memonicsToAvalancheAccount(
  memonics: string,
  options: MnemonicToAccountOptions = {}
): AvalancheAccount {
  const seed = mnemonicToSeedSync(memonics);
  return hdKeyToAvalancheAccount(HDKey.fromMasterSeed(seed), options);
}
