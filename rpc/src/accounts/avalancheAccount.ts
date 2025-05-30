import { Account } from "viem";

/**
 * XPAddress is a type that represents an X or P chain address.
 */
export type XPAddress = string;

/**
 * XPAccount is a type that represents an X or P chain account.
 * It can be a local account or a remote account.
 */
export type XPAccount = LocalXPAccount;

/**
 * LocalXPAccount is a type that represents an X or P chain account.
 * It is a local account.
 */
export type LocalXPAccount = {
  publicKey: string;
  signMessage: (message: string) => Promise<string>;
  signTransaction: (txHash: string | Uint8Array) => Promise<string>;
  verify: (message: string, signature: string) => boolean;
  type: "local";
  source: "hdKey" | "privateKey" | "mnemonic";
};

/**
 * AvalancheAccount is a type that represents an account on the Avalanche network.
 * It can be a combination of an EVM account and an XP account.
 */
export type AvalancheAccount = {
  evmAccount: Account;
  xpAccount?: XPAccount;
};
