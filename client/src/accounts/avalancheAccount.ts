import { Account, Address } from "viem";

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
  /**
   * The EVM account used for C-chain or any EVM chain operations.
   * Type: {@link Account}
   */
  evmAccount: Account;
  /**
   * The AVM and PVM account used for X and P chain operations.
   * Type: {@link XPAccount}
   */
  xpAccount?: XPAccount;
  /**
   * Get the XP address for the X and P chain account.
   * @param chain - The chain to get the XP address for. `"X" | "P" | "C"`
   * @param hrp - The human readable prefix to use for the XP address. Default to `"avax"`. `"avax" | "fuji" | any custom hrp`
   * @returns The XP address for the account. {@link XPAddress}
   */
  getXPAddress: (
    chain?: "X" | "P" | "C" | undefined,
    hrp?: string | undefined
  ) => XPAddress;
  /**
   * Get the EVM address for the account.
   * @returns The EVM address for the account. {@link Address}
   */
  getEVMAddress: () => Address;
};
