import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `index.getContainerByIndex` method.
 *
 * @property index - The index of the container to retrieve. The first container accepted is at index 0.
 * @property encoding - The encoding format for the container data. Only "hex" is supported.
 */
export type GetContainerByIndexParameters = {
  index: number;
  encoding: "hex";
};

/**
 * Return type for the index.getContainerByIndex method.
 *
 * @property id - The container's ID
 * @property bytes - The byte representation of the container
 * @property timestamp - The time at which this node accepted the container
 * @property encoding - The encoding format used for the container data. Only "hex" is supported.
 * @property index - How many containers were accepted in this index before this one
 */
export type GetContainerByIndexReturnType = {
  id: string;
  bytes: string;
  timestamp: string;
  encoding: "hex";
  index: string;
};

export type GetContainerByIndexErrorType = RequestErrorType;

export type GetContainerByIndexMethod = {
  Method: "index.getContainerByIndex";
  Parameters: GetContainerByIndexParameters;
  ReturnType: GetContainerByIndexReturnType;
};
