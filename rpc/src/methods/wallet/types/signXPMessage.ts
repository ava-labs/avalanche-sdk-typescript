import { Address } from "viem";
import { RequestErrorType } from "viem/utils";
import { AvalancheAccount } from "../../../accounts/avalancheAccount.js";

export type SignXPMessageParameters = {
  account?: AvalancheAccount | Address | undefined;
  message: string;
  accountIndex?: number | undefined;
};

export type SignXPMessageReturnType = {
  signature: string;
};

export type SignXPMessageErrorType = RequestErrorType;

export type SignXPMessageMethod = {
  Method: "avalanche_signMessage";
  Parameters: Omit<SignXPMessageParameters, "account">;
  ReturnType: SignXPMessageReturnType;
};
