import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `platform.getSubnets` method.
 * Get information about a set of Subnets.
 * @property ids - The IDs of the Subnets to get information about
 */
export type GetSubnetsParameters = {
  ids: string[];
};

/**
 * Return type for the `platform.getSubnets` method.
 * @property subnets - Information about the requested Subnets
 */
export type GetSubnetsReturnType = {
  subnets: {
    /**
     * The ID of the Subnet.
     */
    id: string;
    /**
     * The control keys of the Subnet.
     */
    controlKeys: string[];
    /**
     * The threshold of control keys required to make changes to the Subnet.
     */
    threshold: string;
  }[];
};

export type GetSubnetsErrorType = RequestErrorType;

export type GetSubnetsMethod = {
  Method: "platform.getSubnets";
  Parameters: GetSubnetsParameters;
  ReturnType: GetSubnetsReturnType;
};
