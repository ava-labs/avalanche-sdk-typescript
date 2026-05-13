/**
 * Tmpnet Type Definitions
 *
 * Interfaces shared across the tmpnet module.  Ported verbatim from
 * avalanche-ai.
 */

import type { Subprocess } from "bun";

export interface NetworkConfig {
  uuid: string;
  created: string;
  avalanchegoPath: string;
  nodeCount: number;
}

export interface NodeConfig {
  nodeId: string;
  httpPort: number;
  stakingPort: number;
  isValidator: boolean;
  trackedSubnets?: string[];
}

export interface ProcessDetails {
  pid: number;
  apiUri: string;
  stakingAddress: string;
}

export interface NodeInfo {
  nodeId: string;
  uri: string;
  stakingAddress: string;
  isValidator: boolean;
  uptime?: number;
  trackedSubnets?: string[];
  blsPublicKey?: string;
  blsProofOfPossession?: string;
}

export interface DetailedNodeInfo extends NodeInfo {
  healthy: boolean;
  error?: string;
}

export interface NetworkStatus {
  running: boolean;
  nodes: NodeInfo[];
  networkName?: string;
}

export interface ChainBootstrapStatus {
  pChain: boolean;
  xChain: boolean;
  cChain: boolean;
  bootstrapped: boolean;
}

export interface DetailedNetworkStatus {
  running: boolean;
  nodes: DetailedNodeInfo[];
  networkName?: string;
  chainStatus?: ChainBootstrapStatus;
}

export interface NetworkListEntry {
  name: string;
  path: string;
  isActive: boolean;
  created?: string;
}

export interface SimpleNetworkStatus {
  running: boolean;
  healthy: boolean;
  nodeCount: number;
}

export interface NodeStartResult {
  proc: Subprocess;
  tempDir: string;
  httpPort: number;
  stakingPort: number;
  stakerNum: number;
}

export interface NodeWaitResult {
  success: boolean;
  nodeId?: string;
  error?: string;
}

export interface PendingNodeData {
  index: number;
  proc: Subprocess;
  tempDir: string;
  httpPort: number;
  stakingPort: number;
  stakerNum: number;
}

export interface NodeConfigEntry {
  dir: string;
  config: NodeConfig;
}
