import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `index.getIndex` method.
 *
 * @property id - The container's ID
 * @property encoding - The encoding format for the container data. Only "hex" is supported.
 */
export type GetIndexParameters = {
  id: string;
  encoding: "hex";
};

/**
 * Return type for the `index.getIndex` method.
 *
 * @property index - The index of the container. The first container accepted is at index 0.
 */
export type GetIndexReturnType = {
  index: string;
};

export type GetIndexErrorType = RequestErrorType;

export type GetIndexMethod = {
  Method: "index.getIndex";
  Parameters: GetIndexParameters;
  ReturnType: GetIndexReturnType;
};
