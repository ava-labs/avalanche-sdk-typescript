import { RequestErrorType } from "viem/utils";

export type GetAssetDescriptionParameters = {
  assetID: string;
}

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