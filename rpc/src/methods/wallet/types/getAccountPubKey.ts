import { RequestErrorType } from "viem/utils";

/**
 * The public key of the account
 * @property evm - The public key of the account in EVM format.
 * @property xp - The public key of the account in XP format.
 */
export type GetAccountPubKeyReturnType = {
  evm: string;
  xp: string;
};

export type GetAccountPubKeyErrorType = RequestErrorType;

export type GetAccountPubKeyMethod = {
  Method: "avalanche_getAccountPubKey";
  Parameters: {};
  ReturnType: GetAccountPubKeyReturnType;
};
