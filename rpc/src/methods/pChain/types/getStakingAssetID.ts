import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `platform.getStakingAssetID` method.
 * Get the ID of the asset used for staking on a Subnet.
 * @property subnetID - The ID of the Subnet to get the staking asset ID for
 */
export type GetStakingAssetIDParameters = {
  subnetID: string;
};

/**
 * Return type for the `platform.getStakingAssetID` method.
 * @property assetID - The ID of the asset used for staking on the Subnet
 */
export type GetStakingAssetIDReturnType = {
  assetID: string;
};

export type GetStakingAssetIDErrorType = RequestErrorType;

export type GetStakingAssetIDMethod = {
  Method: "platform.getStakingAssetID";
  Parameters: GetStakingAssetIDParameters;
  ReturnType: GetStakingAssetIDReturnType;
};
