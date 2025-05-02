import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `admin.alias` method.
 *
 * @property endpoint - The endpoint to alias
 * @property alias - The alias to assign to the endpoint
 */
export type AliasParameters = {
  endpoint: string;
  alias: string;
};

export type AliasErrorType = RequestErrorType;

export type AliasMethod = {
  Method: "admin.alias";
  Parameters: AliasParameters;
  ReturnType: {};
};
