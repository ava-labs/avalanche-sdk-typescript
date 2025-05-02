import { RequestErrorType } from "viem/utils";

/**
 * Return type for the `platform.getBlockchains` method.
 * Get all the blockchains that exist (excluding the P-Chain).
 * @property blockchains - List of blockchains
 * @property blockchains[].id - The ID of the blockchain
 * @property blockchains[].name - The name of the blockchain
 * @property blockchains[].subnetID - The ID of the subnet this blockchain is running on
 * @property blockchains[].vmID - The ID of the Virtual Machine this blockchain runs
 */
export type GetBlockchainsReturnType = {
  blockchains: {
    id: string;
    name: string;
    subnetID: string;
    vmID: string;
  }[];
};

export type GetBlockchainsErrorType = RequestErrorType;

export type GetBlockchainsMethod = {
  Method: "platform.getBlockchains";
  Parameters: {};
  ReturnType: GetBlockchainsReturnType;
};
