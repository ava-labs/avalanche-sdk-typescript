import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `index.getContainerRange` method.
 *
 * @property startIndex - The index of the first container to retrieve
 * @property endIndex - The index of the last container to retrieve (inclusive)
 * @property encoding - The encoding format for the container data. Only "hex" is supported.
 */
export type GetContainerRangeParameters = {
  startIndex: number;
  endIndex: number;
  encoding: "hex";
};

/**
 * Return type for the index.getContainerRange method.
 *
 * @property containers - Array of container details, each containing:
 *   - id: The container's ID
 *   - bytes: The byte representation of the container
 *   - timestamp: The time at which this node accepted the container
 *   - encoding: The encoding format used for the container data. Only "hex" is supported.
 *   - index: How many containers were accepted in this index before this one
 */
export type GetContainerRangeReturnType = {
  containers: Array<{
    id: string;
    bytes: string;
    timestamp: string;
    encoding: "hex";
    index: string;
  }>;
};

export type GetContainerRangeErrorType = RequestErrorType;

export type GetContainerRangeMethod = {
  Method: "index.getContainerRange";
  Parameters: GetContainerRangeParameters;
  ReturnType: GetContainerRangeReturnType;
};
