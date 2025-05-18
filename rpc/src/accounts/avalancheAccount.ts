import { Account, Hex } from "viem";

export type XPAddress = string;

export type XPAccount = LocalXPAccount;

export type LocalXPAccount = {
  publicKey: Hex;
  signMessage: (message: string) => Promise<Hex>;
  signTransaction: (txHash: Hex) => Promise<Hex>;
  verify: (message: Hex, signature: Hex) => boolean;
  type: "local";
  source: "hdKey" | "privateKey" | "mnemonic";
};

export type AvalancheAccount = {
  evmAccount: Account;
  xpAccount?: XPAccount;
};
