import { Hex } from "viem";
import { privateKeyToAccount, PrivateKeyToAccountOptions } from "viem/accounts";
import { AvalancheAccount } from "./avalancheAccount";
import { privateKeyToXPAccount } from "./privateKeyToXPAccount";

export function privateKeyToAvalancheAccount(
  privateKey: Hex,
  options: PrivateKeyToAccountOptions = {}
): AvalancheAccount {
  return {
    evmAccount: privateKeyToAccount(privateKey, options),
    xpAccount: privateKeyToXPAccount(privateKey),
  };
}
