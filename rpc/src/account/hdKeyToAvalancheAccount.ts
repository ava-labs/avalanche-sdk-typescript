import { HDKey } from "@scure/bip32";
import { toHex } from "viem";
import { HDKeyToAccountOptions, privateKeyToAccount } from "viem/accounts";
import { AvalancheAccount, LocalXPAccount } from "./avalancheAccount";
import { privateKeyToXPAccount } from "./privateKeyToXPAccount";

export function hdKeyToAvalancheAccount(
  hdKey_: HDKey,
  {
    accountIndex = 0,
    addressIndex = 0,
    changeIndex = 0,
    xpAccountIndex = 0,
    xpAddressIndex = 0,
    xpChangeIndex = 0,
    path,
    ...options
  }: HDKeyToAccountOptions & {
    xpAccountIndex?: number;
    xpAddressIndex?: number;
    xpChangeIndex?: number;
  } = {}
): AvalancheAccount {
  const cChainHdKey = hdKey_.derive(
    path || `m/44'/60'/${accountIndex}'/${changeIndex}/${addressIndex}`
  );

  const xpChainHdKey = hdKey_.derive(
    path || `m/44'/9000'/${accountIndex}'/${changeIndex}/${addressIndex}`
  );

  const cChainAccount = privateKeyToAccount(
    toHex(cChainHdKey.privateKey!),
    options
  );

  const pChainAccount = privateKeyToXPAccount(toHex(xpChainHdKey.privateKey!));

  return {
    evmAccount: {
      ...cChainAccount,
      getHdKey: () => cChainHdKey,
    } as any,
    xpAccount: {
      ...pChainAccount,
      source: "hdKey",
      getHdKey: () => xpChainHdKey,
    } as LocalXPAccount,
  };
}
