import { Address } from "viem";
import { RequestErrorType } from "viem/utils";
import { AvalancheAccount } from "../../../accounts/avalancheAccount.js";

/**
 * The parameters for the signXPMessage method
 * @property message - The message to sign. `string`
 * @property account - Optional, the account to use for the message. {@link AvalancheAccount}, {@link Address}
 * @property accountIndex - Optional, the account index to use for the message from custom transport (eg: core extension). `number`
 */
export type SignXPMessageParameters = {
  account?: AvalancheAccount | Address | undefined;
  message: string;
  accountIndex?: number | undefined;
};

/**
 * The return type for the signXPMessage method
 * @property signature - The signature of the message. `string`
 */
export type SignXPMessageReturnType = {
  signature: string;
};

export type SignXPMessageErrorType = RequestErrorType;

export type SignXPMessageMethod = {
  Method: "avalanche_signMessage";
  Parameters: Omit<SignXPMessageParameters, "account">;
  ReturnType: SignXPMessageReturnType;
};
