import { Account, Hex, NonceManager } from "viem";

export type XPAddress = string;

export type XPAccount = LocalXPAccount;

export type LocalXPAccount = {
  nonceManager?: NonceManager | undefined;
  publicKey: Hex;
  signMessage: (message: string) => Promise<Hex>;
  signTransaction: (txHash: Hex | Uint8Array) => Promise<Hex>;
  verify: (message: Hex, signature: Hex) => boolean;
  type: "local";
  source: "hdKey" | "privateKey" | "mnemonic";
};

export type AvalancheAccount = {
  evmAccount: Account;
  xpAccount?: XPAccount;
};
