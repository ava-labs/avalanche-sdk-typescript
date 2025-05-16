import { RequestErrorType } from "viem/utils";

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
