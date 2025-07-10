import { RequestErrorType } from "viem/utils";

/**
 * Return type for the info.getNodeVersion method.
 * @property version - The version of the node (e.g. "avalanche/1.9.4")
 * @property databaseVersion - The version of the database
 * @property rpcProtocolVersion - The version of the RPC protocol
 * @property vmVersions - Map of VM IDs to their versions
 */
export type GetNodeVersionReturnType = {
  version: string;
  databaseVersion: string;
  gitCommit: string;
  vmVersions: Map<string, string>;
  rpcProtocolVersion: string;
};

export type GetNodeVersionErrorType = RequestErrorType;

export type GetNodeVersionMethod = {
  Method: "info.getNodeVersion";
  Parameters: {};
  ReturnType: GetNodeVersionReturnType;
};
