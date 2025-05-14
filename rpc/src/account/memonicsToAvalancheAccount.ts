import { HDKey } from "@scure/bip32";
import { mnemonicToSeedSync } from "@scure/bip39";
import { MnemonicToAccountOptions } from "viem/accounts";
import { AvalancheAccount } from "./avalancheAccount";
import { hdKeyToAvalancheAccount } from "./hdKeyToAvalancheAccount";

export function memonicsToAvalancheAccount(
  memonics: string,
  options: MnemonicToAccountOptions = {}
): AvalancheAccount {
  const seed = mnemonicToSeedSync(memonics);
  return hdKeyToAvalancheAccount(HDKey.fromMasterSeed(seed), options);
}
