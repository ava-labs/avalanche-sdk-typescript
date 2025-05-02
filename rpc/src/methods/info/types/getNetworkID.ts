import { RequestErrorType } from "viem/utils";

/**
 * Return type for the info.getNetworkID method.
 * @property networkID - The ID of the network (1 for Mainnet, 5 for Fuji testnet)
 */
export type GetNetworkIDReturnType = {
  networkID: string;
};

export type GetNetworkIDErrorType = RequestErrorType;

export type GetNetworkIDMethod = {
  Method: "info.getNetworkID";
  Parameters: {};
  ReturnType: GetNetworkIDReturnType;
};
