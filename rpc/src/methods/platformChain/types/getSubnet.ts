import { RequestErrorType } from "viem/utils";

export type GetSubnetParameters = {
  subnetID: string;
};

export type GetSubnetReturnType = {
  isPermissioned: boolean;
  controlKeys: string[];
  threshold: string;
  locktime: string;
  subnetTransformationTxID: string;
  conversionID: string;
  managerChainID: string;
  managerAddress: string | null;
};

export type GetSubnetErrorType = RequestErrorType;

export type GetSubnetMethod = {
  Method: "platform.getSubnet";
  Parameters: GetSubnetParameters;
  ReturnType: GetSubnetReturnType;
};
