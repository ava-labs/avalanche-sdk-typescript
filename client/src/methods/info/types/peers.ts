import { RequestErrorType } from "viem/utils";

/**
 * Parameters for the info.peers method.
 * @property nodeIDs - Optional array of node IDs to filter peers
 */
export type PeersParameters = {
  nodeIDs?: string[];
};

/**
 * Return type for the info.peers method.
 * @property numPeers - The number of connected peers
 * @property peers - Array of peer information
 */
export type PeersReturnType = {
  numPeers: number;
  peers: {
    /** The remote IP of the peer */
    ip: string;
    /** The public IP of the peer */
    publicIP: string;
    /** The prefixed Node ID of the peer */
    nodeID: string;
    /** The version the peer is running */
    version: string;
    /** Timestamp of last message sent to the peer */
    lastSent: string;
    /** Timestamp of last message received from the peer */
    lastReceived: string;
    /** Array of chain IDs the peer is benched on */
    benched: string[];
    /** The node's primary network uptime observed by the peer */
    observedUptime: number;
  }[];
};

export type PeersErrorType = RequestErrorType;

export type PeersMethod = {
  Method: "info.peers";
  Parameters: PeersParameters;
  ReturnType: PeersReturnType;
};
