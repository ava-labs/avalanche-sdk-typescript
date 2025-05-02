import { RequestErrorType } from "viem/utils";

/**
 * Return type for the info.getNodeID method.
 * @property nodeID - The unique identifier of the node
 * @property nodePOP - The node's BLS key and proof of possession
 * @property nodePOP.publicKey - The 48 byte hex representation of the BLS key
 * @property nodePOP.proofOfPossession - The 96 byte hex representation of the BLS signature
 */
export type GetNodeIDReturnType = {
  nodeID: string;
  nodePOP: {
    publicKey: string;
    proofOfPossession: string;
  };
};

export type GetNodeIDErrorType = RequestErrorType;

export type GetNodeIDMethod = {
  Method: "info.getNodeID";
  Parameters: {};
  ReturnType: GetNodeIDReturnType;
};
