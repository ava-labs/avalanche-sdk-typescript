import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `index.getContainerByID` method.
 *
 * @property id - The container's ID
 * @property encoding - The encoding format for the container data. Only "hex" is supported.
 */
export type GetContainerByIDParameters = {
  id: string;
  encoding: "hex";
};

/**
 * Return type for the `index.getContainerByID` method.
 *
 * @property id - The container's ID
 * @property bytes - The byte representation of the container
 * @property timestamp - The time at which this node accepted the container
 * @property encoding - The encoding format used for the container data. Only "hex" is supported.
 * @property index - How many containers were accepted in this index before this one
 */
export type GetContainerByIDReturnType = {
  id: string;
  bytes: string;
  timestamp: string;
  encoding: "hex";
  index: string;
};

export type GetContainerByIDErrorType = RequestErrorType;

export type GetContainerByIDMethod = {
  Method: "index.getContainerByID";
  Parameters: GetContainerByIDParameters;
  ReturnType: GetContainerByIDReturnType;
};
