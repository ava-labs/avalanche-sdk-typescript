import { Account, Hex } from "viem";

export type XPAddress = string;

export type XPAccount = LocalXPAccount;

export type LocalXPAccount = {
  publicKey: Hex;
  sign: (
    message: Hex | Uint8Array,
    to: "hex" | "bytes"
  ) => Promise<Hex | Uint8Array>;
  verify: (
    message: Hex | Uint8Array,
    signature: Hex | Uint8Array,
    publicKey: Hex | Uint8Array
  ) => boolean;
  recoverPublicKey: (
    message: Hex | Uint8Array,
    signature: Hex | Uint8Array,
    to: "hex" | "bytes"
  ) => Hex | Uint8Array;
  type: "local";
  source: "hdKey" | "privateKey" | "mnemonic";
};

export type AvalancheAccount = {
  evmAccount: Account;
  XPAccount?: XPAccount;
};
