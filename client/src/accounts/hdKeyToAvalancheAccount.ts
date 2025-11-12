import { HDKey } from "@scure/bip32";
import { toHex } from "viem";
import { HDKeyToAccountOptions, privateKeyToAccount } from "viem/accounts";
import { AvalancheAccount, LocalXPAccount } from "./avalancheAccount.js";
import { privateKeyToXPAccount } from "./privateKeyToXPAccount.js";
import { publicKeyToXPAddress } from "./utils/publicKeyToXPAddress.js";

/**
 * Options for the hdKeyToAvalancheAccount function.
 */
export type HDKeyToAvalancheAccountOptions = HDKeyToAccountOptions & {
  xpAccountIndex?: number;
  xpAddressIndex?: number;
  xpChangeIndex?: number;
};

/**
 * Converts a HD key to an Avalanche account.
 *
 * Derives the C-chain and P-chain accounts from the HD key.
 * @see https://support.avax.network/en/articles/7004986-what-derivation-paths-does-avalanche-use
 *
 * @param hdKey_ - The HD key to convert. {@link HDKey}
 * @param options - The options for the account. {@link HDKeyToAvalancheAccountOptions}
 * @returns The Avalanche account {@link AvalancheAccount}.
 */
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
    xpPath,
    ...options
  }: HDKeyToAccountOptions & {
    xpAccountIndex?: number;
    xpAddressIndex?: number;
    xpChangeIndex?: number;
    xpPath?: string;
  } = {}
): AvalancheAccount {
  const cChainHdKey = hdKey_.derive(
    path || `m/44'/60'/${accountIndex}'/${changeIndex}/${addressIndex}`
  );

  const xpChainHdKey = hdKey_.derive(
    xpPath ||
      `m/44'/9000'/${xpAccountIndex}'/${xpChangeIndex}/${xpAddressIndex}`
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
      source: "hdKey",
    } as any,
    xpAccount: {
      ...pChainAccount,
      source: "hdKey",
      getHdKey: () => xpChainHdKey,
    } as LocalXPAccount,
    getXPAddress: (
      chain?: "X" | "P" | "C" | undefined,
      hrp: string = "avax"
    ) => {
      if (chain) {
        return `${chain}-${publicKeyToXPAddress(pChainAccount.publicKey, hrp)}`;
      }
      return publicKeyToXPAddress(pChainAccount.publicKey, hrp);
    },
    getEVMAddress: () => cChainAccount.address,
  };
}
