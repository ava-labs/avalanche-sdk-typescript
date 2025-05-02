import { RequestErrorType } from "viem/utils";

/**
 * Return type for the info.getNetworkName method.
 * @property networkName - The name of the network (e.g. "mainnet", "fuji", "local")
 */
export type GetNetworkNameReturnType = {
  networkName: string;
};

export type GetNetworkNameErrorType = RequestErrorType;

export type GetNetworkNameMethod = {
  Method: "info.getNetworkName";
  Parameters: {};
  ReturnType: GetNetworkNameReturnType;
};
