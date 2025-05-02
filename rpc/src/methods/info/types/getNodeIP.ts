import { RequestErrorType } from "viem/utils";

/**
 * Return type for the info.getNodeIP method.
 * @property ip - The IP address of the node
 */
export type GetNodeIPReturnType = {
  ip: string;
};

export type GetNodeIPErrorType = RequestErrorType;

export type GetNodeIPMethod = {
  Method: "info.getNodeIP";
  Parameters: {};
  ReturnType: GetNodeIPReturnType;
};
