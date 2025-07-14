import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `admin.getChainAliases` method.
 *
 * @property chain - The blockchain ID to get aliases for
 */
export type GetChainAliasesParameters = {
  chain: string;
};

/**
 * Return type for the `admin.getChainAliases` method.
 *
 * @property aliases - Array of aliases for the specified blockchain
 */
export type GetChainAliasesReturnType = {
  aliases: string[];
};

export type GetChainAliasesErrorType = RequestErrorType;

export type GetChainAliasesMethod = {
  Method: "admin.getChainAliases";
  Parameters: GetChainAliasesParameters;
  ReturnType: GetChainAliasesReturnType;
};
