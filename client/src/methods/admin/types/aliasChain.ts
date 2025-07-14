import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `admin.aliasChain` method.
 *
 * @property chain - The blockchain ID to alias
 * @property alias - The alias to assign to the blockchain
 */
export type AliasChainParameters = {
  chain: string;
  alias: string;
};

export type AliasChainErrorType = RequestErrorType;

export type AliasChainMethod = {
  Method: "admin.aliasChain";
  Parameters: AliasChainParameters;
  ReturnType: {};
};
