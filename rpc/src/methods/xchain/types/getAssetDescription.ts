import { RequestErrorType } from "viem/utils";

/**
 * The parameters for the `avm.getAssetDescription` method.
 *
 * @property assetID - The asset ID.
 */
export type GetAssetDescriptionParameters = {
  assetID: string;
};

/**
 * The return type for the `avm.getAssetDescription` method.
 *
 * @property assetID - The asset ID.
 * @property name - The name of the asset.
 * @property symbol - The symbol of the asset.
 * @property denomination - The denomination of the asset.
 */
export type GetAssetDescriptionReturnType = {
  assetID: string;
  name: string;
  symbol: string;
  denomination: number;
};

export type GetAssetDescriptionErrorType = RequestErrorType;

export type GetAssetDescriptionMethod = {
  Method: "avm.getAssetDescription";
  Parameters: GetAssetDescriptionParameters;
  ReturnType: GetAssetDescriptionReturnType;
};
