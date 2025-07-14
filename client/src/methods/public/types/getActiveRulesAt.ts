import { RequestErrorType } from "viem/utils";

/**
 * The parameters for the `eth_getActiveRulesAt` method.
 *
 * @property timestamp - The timestamp at which to retrieve the active rules.
 */
export type GetActiveRulesAtParameters = {
  timestamp: string;
};

/**
 * The return type for the `eth_getActiveRulesAt` method.
 *
 * @property ethRules - The active rules for the Ethereum chain.
 * @property avalancheRules - The active rules for the Avalanche chain.
 * @property precompiles - The precompiles for the Ethereum chain.
 */
export type GetActiveRulesAtReturnType = {
  ethRules: Map<string, true>;
  avalancheRules: Map<string, true>;
  precompiles: Map<string, object>;
};

export type GetActiveRulesAtErrorType = RequestErrorType;

export type GetActiveRulesAtMethod = {
  Method: "eth_getActiveRulesAt";
  Parameters: [GetActiveRulesAtParameters];
  ReturnType: GetActiveRulesAtReturnType;
};
