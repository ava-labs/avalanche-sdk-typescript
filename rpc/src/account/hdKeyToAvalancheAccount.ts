import { HDKey } from "@scure/bip32";
import { toHex } from "viem";
import { HDKeyToAccountOptions } from "viem/accounts";
import { AvalancheAccount, LocalXPAccount } from "./avalancheAccount";
import { privateKeyToAvalancheAccount } from "./privateKeyToAvalancheAccount";

export function hdKeyToAvalancheAccount(
  hdKey_: HDKey,
  {
    accountIndex = 0,
    addressIndex = 0,
    changeIndex = 0,
    path,
    ...options
  }: HDKeyToAccountOptions = {}
): AvalancheAccount & {
  getHdKey: () => HDKey;
} {
  const hdKey = hdKey_.derive(
    path || `m/44'/60'/${accountIndex}'/${changeIndex}/${addressIndex}`
  );
  const account = privateKeyToAvalancheAccount(
    toHex(hdKey.privateKey!),
    options
  );
  return {
    evmAccount: account.evmAccount,
    xpAccount: {
      ...account.xpAccount,
      source: "hdKey",
    } as LocalXPAccount,
    getHdKey: () => hdKey,
  };
}
