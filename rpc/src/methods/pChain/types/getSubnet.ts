import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `platform.getSubnet` method.
 * Get information about a Subnet.
 * @property subnetID - The ID of the Subnet to get information about
 */
export type GetSubnetParameters = {
  subnetID: string;
};

/**
 * Return type for the `platform.getSubnet` method.
 * @property isPermissioned - Whether the Subnet is permissioned
 * @property controlKeys - The control keys of the Subnet
 * @property threshold - The threshold of control keys required to make changes to the Subnet
 * @property locktime - The locktime of the Subnet
 * @property subnetTransformationTxID - The ID of the transaction that transformed the Subnet
 * @property conversionID - The ID of the conversion
 * @property managerChainID - The ID of the manager chain
 * @property managerAddress - The address of the manager
 */
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
