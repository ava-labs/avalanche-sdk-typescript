import { AvalancheAccount } from "@/account/avalancheAccount";
import { Address, Hex } from "viem";
import { RequestErrorType } from "viem/utils";

export type SignXPMessageParameters = {
  account?: AvalancheAccount | Address | undefined;
  message: Hex;
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
