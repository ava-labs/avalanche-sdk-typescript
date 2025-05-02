import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `index.isAccepted` method.
 *
 * @property id - The container's ID
 * @property encoding - The encoding format for the container data. Only "hex" is supported.
 */
export type IsAcceptedParameters = {
  id: string;
  encoding: "hex";
};

/**
 * Return type for the `index.isAccepted` method.
 *
 * @property isAccepted - Whether the container is in this index
 */
export type IsAcceptedReturnType = {
  isAccepted: boolean;
};

export type IsAcceptedErrorType = RequestErrorType;

export type IsAcceptedMethod = {
  Method: "index.isAccepted";
  Parameters: IsAcceptedParameters;
  ReturnType: IsAcceptedReturnType;
};
