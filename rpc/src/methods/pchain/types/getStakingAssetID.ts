import { RequestErrorType } from "viem/utils";

export type GetStakingAssetIDParameters = {
    subnetID: string;
}
  
export type GetStakingAssetIDReturnType = {
    assetID: string;
}

export type GetStakingAssetIDErrorType = RequestErrorType;

export type GetStakingAssetIDMethod = {
    Method: "platform.getStakingAssetID";
    Parameters: GetStakingAssetIDParameters;
    ReturnType: GetStakingAssetIDReturnType;
}