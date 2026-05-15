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
  /**
   * Absolute path to the node's BLS staking-signer key file (32 raw bytes
   * = the BLS12-381 secret scalar serialised big-endian). Avalanchego writes
   * this file at `${data-dir}/staking/signer.key` on first boot when no
   * `--staking-signer-key-file` is supplied (the L1-node path), or it points
   * at the preconfigured `STAKING_KEYS_DIR/signer<N>.key` for primary nodes
   * that loaded a vendored staker.
   *
   * Read it when you need to BLS-sign on behalf of this node (e.g. the
   * `RegisterL1ValidatorMessage` payload for a new L1 validator). Stays
   * `undefined` when the node uses ephemeral keys with no persistent file.
   */
  signerKeyPath?: string;
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
