import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `index.getLastAccepted` method.
 *
 * @property encoding - The encoding format for the container data. Only "hex" is supported.
 */
export type GetLastAcceptedParameters = {
  encoding: "hex";
};

/**
 * Return type for the `index.getLastAccepted` method.
 *
 * @property id - The container's ID
 * @property bytes - The byte representation of the container
 * @property timestamp - The time at which this node accepted the container
 * @property encoding - The encoding format used for the container data. Only "hex" is supported.
 * @property index - How many containers were accepted in this index before this one
 */
export type GetLastAcceptedReturnType = {
  id: string;
  bytes: string;
  timestamp: string;
  encoding: "hex";
  index: string;
};

export type GetLastAcceptedErrorType = RequestErrorType;

export type GetLastAcceptedMethod = {
  Method: "index.getLastAccepted";
  Parameters: GetLastAcceptedParameters;
  ReturnType: GetLastAcceptedReturnType;
};
