import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the info.isBootstrapped method.
 * @property chain - The ID or alias of the chain to check
 */
export type IsBootstrappedParameters = {
  chain: string;
};

/**
 * Return type for the info.isBootstrapped method.
 * @property isBootstrapped - Whether the chain is done bootstrapping
 */
export type IsBootstrappedReturnType = {
  isBootstrapped: boolean;
};

export type IsBootstrappedErrorType = RequestErrorType;

export type IsBootstrappedMethod = {
  Method: "info.isBootstrapped";
  Parameters: IsBootstrappedParameters;
  ReturnType: IsBootstrappedReturnType;
};
