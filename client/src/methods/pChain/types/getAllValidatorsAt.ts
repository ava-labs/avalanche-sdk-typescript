import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the `platform.getAllValidatorsAt` method.
 * Get all validators at a given height across all Subnets and the Primary Network.
 * @property height - The P-Chain height to get validators at, or "proposed" to return the validator set at the node's proposervm height
 */
export type GetAllValidatorsAtParameters = {
  height: number | "proposed";
};

/**
 * Return type for the `platform.getAllValidatorsAt` method.
 * @property validatorSets - A map of Subnet IDs to their validator information
 */
export type GetAllValidatorsAtReturnType = {
  validatorSets: Record<
    string,
    {
      validators: Array<{
        publicKey: string;
        weight: string;
        nodeIDs: string[];
      }>;
      totalWeight: string;
    }
  >;
};

export type GetAllValidatorsAtErrorType = RequestErrorType;

export type GetAllValidatorsAtMethod = {
  Method: "platform.getAllValidatorsAt";
  Parameters: GetAllValidatorsAtParameters;
  ReturnType: GetAllValidatorsAtReturnType;
};
