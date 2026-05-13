/**
 * Tmpnet Manager
 *
 * Manages temporary Avalanche networks for local development / e2e tests.
 *
 * Directory structure (matches avalanchego tmpnet spec):
 *   ~/.avalanche-cli/tmpnet/
 *     networks/
 *       <network-name>/           # Named network directory
 *         config.json             # Network configuration
 *         network.env             # Environment variables for the network
 *         NodeID-<id>/            # Node directory named by NodeID
 *           config.json           # Node runtime configuration
 *           process.json          # Process details (PID, API URI)
 *           db/                   # Database
 *           logs/                 # Logs
 *           chainData/            # Chain data
 *         subnets/                # Subnet configurations
 *       latest -> <network-name>  # Symlink to most recent network
 *
 * Ported from avalanche-ai with the DI ConfigService dependency stripped:
 *   - the active network is tracked in `network-operations.ts` module state
 *   - the optional signature aggregator is now passed via constructor instead
 *     of being injected through a service container
 */

import { existsSync } from "fs";
import { join } from "path";
import { readFile, stat } from "fs/promises";

import { logger } from "../utils/logger.ts";
import type { CommandOutput, IDisposable } from "../utils/types.ts";
import { ensureAvalanchego, getCachedAvalanchegoPath, setCachedAvalanchegoPath } from "../avalanchego.ts";
import type {
  SignatureAggregatorManager,
  SignatureAggregatorStatus,
} from "../signature-aggregator/index.ts";
import { AsyncMutex, withGlobalLock } from "./lock.ts";

import { NETWORKS_DIR, PLUGIN_DIR, STAKING_KEYS_DIR } from "./constants.ts";
import {
  addL1Node as addL1NodeOp,
  configureL1Node as configureL1NodeOp,
  restartL1Node as restartL1NodeOp,
  restartNodeById as restartNodeByIdOp,
  stopNodeById as stopNodeByIdOp,
} from "./l1-operations.ts";
import {
  createNetwork as createNetworkOp,
  deleteNetwork as deleteNetworkOp,
  getCurrentNetworkName,
  listNetworks as listNetworksOp,
  restartExistingNodes,
  setCurrentNetworkDir,
  stopNetwork as stopNetworkOp,
  updateLatestSymlink,
} from "./network-operations.ts";
import { getNodeDirectories, loadNodeConfig } from "./node-operations.ts";
import { checkChainBootstrapStatus, checkNodeHealth } from "./process.ts";
import type {
  DetailedNetworkStatus,
  DetailedNodeInfo,
  NetworkListEntry,
  NetworkStatus,
  NodeInfo,
  SimpleNetworkStatus,
} from "./types.ts";

// ----------------------------------------------------------------------------
// Re-exports
// ----------------------------------------------------------------------------

export * from "./types.ts";
export * from "./constants.ts";
export {
  safeProgress,
  waitForNode,
  waitForNodeBootstrapped,
  checkNodeHealth,
  areNodesAlreadyRunning,
} from "./process.ts";
export { getNodeDirectories, loadNodeConfig } from "./node-operations.ts";
export {
  acquireNetworkLock,
  acquireGlobalLock,
  withNetworkLock,
  withGlobalLock,
  getNetworkLockStatus,
  getGlobalLockStatus,
  cleanupStaleLocks,
  type LockHandle,
  type LockOptions,
} from "./lock.ts";

// ============================================================================
// Log Reading Utilities
// ============================================================================

export function getNodeLogPath(nodeId: string, networkName?: string): string {
  const network = networkName ?? getCurrentNetworkName() ?? "default";
  return join(NETWORKS_DIR, network, nodeId, "logs", "main.log");
}

export async function readLogLines(logPath: string, numLines = 50, levelFilter?: string): Promise<string[]> {
  try {
    const content = await readFile(logPath, "utf-8");
    let lines = content.split("\n").filter((line) => line.trim().length > 0);

    if (levelFilter) {
      const level = levelFilter.toUpperCase();
      lines = lines.filter(
        (line) =>
          line.toUpperCase().includes(`[${level}]`) ||
          line.toUpperCase().includes(` ${level} `) ||
          line.toUpperCase().includes(`"level":"${level}"`)
      );
    }

    return lines.slice(-numLines);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return [`Log file not found: ${logPath}`, "Node may not have started yet or logs were cleared."];
    }
    return [`Error reading log file: ${err.message}`];
  }
}

export async function getLogStats(logPath: string): Promise<{
  exists: boolean;
  size: number;
  sizeFormatted: string;
  modified: Date | null;
}> {
  try {
    const stats = await stat(logPath);
    return {
      exists: true,
      size: stats.size,
      sizeFormatted: formatBytes(stats.size),
      modified: stats.mtime,
    };
  } catch {
    return { exists: false, size: 0, sizeFormatted: "0 B", modified: null };
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ============================================================================
// TmpnetManager
// ============================================================================

export interface TmpnetManagerConfig {
  /**
   * Optional signature aggregator.  If provided, it will be started/stopped
   * alongside the network.  If omitted, no aggregator lifecycle management
   * happens (callers can manage their own).
   */
  signatureAggregator?: SignatureAggregatorManager;
  /** Override the avalanchego binary path (defaults to discovering one). */
  avalanchegoPath?: string;
  /** Override the plugin directory. */
  pluginDir?: string;
  /** Override the staking keys directory. */
  stakingKeysDir?: string;
}

/**
 * Main class for managing temporary Avalanche networks.
 */
export class TmpnetManager implements IDisposable {
  private avalanchegoPath: string;
  private readonly stakingKeysDir: string;
  private readonly pluginDir: string;
  private signatureAggregatorEnabled = true;
  private readonly sigAggService: SignatureAggregatorManager | undefined;

  /** In-process mutex to serialize state-changing operations. */
  private mutex = new AsyncMutex();

  constructor(config: TmpnetManagerConfig = {}) {
    this.sigAggService = config.signatureAggregator;
    this.avalanchegoPath = config.avalanchegoPath ?? getCachedAvalanchegoPath() ?? "";
    this.stakingKeysDir = config.stakingKeysDir ?? STAKING_KEYS_DIR;
    this.pluginDir = config.pluginDir ?? PLUGIN_DIR;
    if (this.avalanchegoPath) {
      setCachedAvalanchegoPath(this.avalanchegoPath);
    }
  }

  /** Toggle automatic signature-aggregator start/stop alongside the network. */
  setSignatureAggregatorEnabled(enabled: boolean): void {
    this.signatureAggregatorEnabled = enabled;
  }

  /**
   * Stop the network + signature aggregator.  Best-effort, never throws.
   */
  async dispose(): Promise<void> {
    try {
      await this.stopSignatureAggregator();
      await this.stopNetworkInternal();
    } catch (error) {
      logger.fileError(
        `Error during TmpnetManager disposal: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // --------------------------------------------------------------------------
  // Network Management
  // --------------------------------------------------------------------------

  async createNetwork(
    name: string,
    nodeCount = 1,
    onProgress?: (message: string) => void
  ): Promise<
    CommandOutput<{ networkDir: string; nodes: NodeInfo[]; signatureAggregator?: SignatureAggregatorStatus }>
  > {
    return this.mutex.withLock(async () => {
      try {
        await this.stopNetworkInternal();

        const avalanchego = await this.ensureAvalanchego(onProgress);
        if (!avalanchego) {
          return {
            success: false,
            error: { code: "DOWNLOAD_FAILED", message: "Failed to find or download avalanchego" },
          };
        }

        const result = await createNetworkOp(name, nodeCount, avalanchego, this.pluginDir, onProgress);

        if (result.success && result.data && this.signatureAggregatorEnabled && this.sigAggService) {
          const sigAggStatus = await this.startSignatureAggregator(result.data.networkDir, onProgress);
          return {
            ...result,
            data: { ...result.data, signatureAggregator: sigAggStatus },
          };
        }

        return result as CommandOutput<{
          networkDir: string;
          nodes: NodeInfo[];
          signatureAggregator?: SignatureAggregatorStatus;
        }>;
      } catch (err) {
        const errMsg = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
        return { success: false, error: { code: "EXECUTION_ERROR", message: `createNetwork crashed: ${errMsg}` } };
      }
    });
  }

  /**
   * Switch to an existing network session.  Stops the previous network if it
   * is different from the target.
   */
  async switchNetwork(
    name: string,
    onProgress?: (message: string) => void
  ): Promise<
    CommandOutput<{ networkDir: string; nodes: NodeInfo[]; signatureAggregator?: SignatureAggregatorStatus }>
  > {
    const networkPath = join(NETWORKS_DIR, name);

    if (!existsSync(networkPath)) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: `Network '${name}' does not exist. Use 'new' to create it.` },
      };
    }

    const configPath = join(networkPath, "config.json");
    if (!existsSync(configPath)) {
      return {
        success: false,
        error: { code: "VALIDATION_FAILED", message: `Network '${name}' is invalid (missing config.json)` },
      };
    }

    return withGlobalLock(
      async () => {
        const currentNetwork = getCurrentNetworkName();
        const isSameNetwork = currentNetwork === name;

        if (!isSameNetwork && currentNetwork) {
          onProgress?.(`stopping current network '${currentNetwork}'...`);
          await this.stopNetwork();
        }

        const avalanchego = await this.ensureAvalanchego(onProgress);
        if (!avalanchego) {
          return {
            success: false,
            error: { code: "DOWNLOAD_FAILED", message: "Failed to find or download avalanchego" },
          };
        }

        onProgress?.(`switching to network '${name}'...`);

        await updateLatestSymlink(networkPath);

        const result = await restartExistingNodes(avalanchego, networkPath, this.pluginDir, onProgress);

        if (result.success && result.data && this.signatureAggregatorEnabled && this.sigAggService) {
          const sigAggStatus = await this.startSignatureAggregator(result.data.networkDir, onProgress);
          return {
            ...result,
            data: { ...result.data, signatureAggregator: sigAggStatus },
          };
        }

        return result as CommandOutput<{
          networkDir: string;
          nodes: NodeInfo[];
          signatureAggregator?: SignatureAggregatorStatus;
        }>;
      },
      { operation: `switchNetwork:${name}` }
    );
  }

  async deleteNetwork(name: string): Promise<CommandOutput<void>> {
    return deleteNetworkOp(name);
  }

  listNetworks(): NetworkListEntry[] {
    return listNetworksOp();
  }

  async stopNetwork(): Promise<CommandOutput<void>> {
    return this.mutex.withLock(() => this.stopNetworkInternal());
  }

  private async stopNetworkInternal(): Promise<CommandOutput<void>> {
    await this.stopSignatureAggregator();
    return stopNetworkOp();
  }

  // --------------------------------------------------------------------------
  // Signature Aggregator
  // --------------------------------------------------------------------------

  async startSignatureAggregator(
    networkDir?: string,
    onProgress?: (message: string) => void
  ): Promise<SignatureAggregatorStatus> {
    if (!this.sigAggService) {
      return { running: false, healthy: false, error: "No signature aggregator configured" };
    }
    const dir = networkDir ?? this.getNetworkDir();
    if (!dir) {
      return { running: false, healthy: false, error: "No network directory" };
    }
    return this.sigAggService.start(dir, {}, onProgress);
  }

  async stopSignatureAggregator(): Promise<void> {
    if (!this.sigAggService) return;
    await this.sigAggService.stop();
  }

  async getSignatureAggregatorStatus(): Promise<SignatureAggregatorStatus> {
    if (!this.sigAggService) {
      return { running: false, healthy: false };
    }
    return this.sigAggService.getStatus();
  }

  // --------------------------------------------------------------------------
  // Status
  // --------------------------------------------------------------------------

  async getStatus(options?: { primaryNetworkOnly?: boolean }): Promise<CommandOutput<NetworkStatus>> {
    const currentNetwork = getCurrentNetworkName();
    if (!currentNetwork) {
      return { success: true, data: { running: false, nodes: [] } };
    }

    const networkPath = join(NETWORKS_DIR, currentNetwork);
    const nodeDirs = getNodeDirectories(networkPath);

    const healthChecks = nodeDirs.map(async (nodeDir) => {
      const nodePath = join(networkPath, nodeDir);
      const nodeConfig = loadNodeConfig(nodePath);
      if (!nodeConfig) return null;

      const uri = `http://127.0.0.1:${nodeConfig.httpPort}`;
      const health = await checkNodeHealth(uri, false, options);

      if (health.healthy && health.nodeId) {
        return {
          nodeId: health.nodeId,
          uri,
          stakingAddress: `127.0.0.1:${nodeConfig.stakingPort}`,
          isValidator: nodeConfig.isValidator,
          uptime: 1,
          trackedSubnets: nodeConfig.trackedSubnets,
        } as NodeInfo;
      }
      return null;
    });

    const results = await Promise.all(healthChecks);
    const nodes = results.filter((n): n is NodeInfo => n !== null);

    return {
      success: true,
      data: { running: nodes.length > 0, nodes, networkName: currentNetwork },
    };
  }

  async getDetailedStatus(): Promise<CommandOutput<DetailedNetworkStatus>> {
    const currentNetwork = getCurrentNetworkName();
    if (!currentNetwork) {
      return { success: true, data: { running: false, nodes: [] } };
    }

    const networkPath = join(NETWORKS_DIR, currentNetwork);
    const nodeDirs = getNodeDirectories(networkPath);

    const healthChecks = nodeDirs.map(async (nodeDir) => {
      const nodePath = join(networkPath, nodeDir);
      const nodeConfig = loadNodeConfig(nodePath);

      if (!nodeConfig) {
        return {
          nodeId: nodeDir,
          uri: "",
          stakingAddress: "",
          isValidator: false,
          uptime: 0,
          healthy: false,
          error: "invalid config",
        } as DetailedNodeInfo;
      }

      const uri = `http://127.0.0.1:${nodeConfig.httpPort}`;
      const isL1Node = nodeConfig.trackedSubnets && nodeConfig.trackedSubnets.length > 0;
      const health = await checkNodeHealth(uri, false, isL1Node ? { primaryNetworkOnly: true } : undefined);

      if (health.healthy) {
        return {
          nodeId: health.nodeId || nodeConfig.nodeId,
          uri,
          stakingAddress: `127.0.0.1:${nodeConfig.stakingPort}`,
          isValidator: nodeConfig.isValidator,
          uptime: 1,
          trackedSubnets: nodeConfig.trackedSubnets,
          healthy: true,
        } as DetailedNodeInfo;
      }
      return {
        nodeId: nodeConfig.nodeId || nodeDir,
        uri,
        stakingAddress: `127.0.0.1:${nodeConfig.stakingPort}`,
        isValidator: nodeConfig.isValidator,
        uptime: 0,
        trackedSubnets: nodeConfig.trackedSubnets,
        healthy: false,
        error: health.error,
      } as DetailedNodeInfo;
    });

    const nodes = await Promise.all(healthChecks);
    const healthyCount = nodes.filter((n) => n.healthy).length;

    let chainStatus: { pChain: boolean; xChain: boolean; cChain: boolean; bootstrapped: boolean } | undefined;
    const primaryNode = nodes.find((n) => n.healthy && n.uri);
    if (primaryNode?.uri) {
      chainStatus = await checkChainBootstrapStatus(primaryNode.uri);
    }

    return {
      success: true,
      data: { running: healthyCount > 0, nodes, networkName: currentNetwork, chainStatus },
    };
  }

  async getNetworkStatus(): Promise<SimpleNetworkStatus> {
    const currentNetwork = getCurrentNetworkName();
    if (!currentNetwork) {
      return { running: false, healthy: false, nodeCount: 0 };
    }

    const networkPath = join(NETWORKS_DIR, currentNetwork);
    const nodeDirs = getNodeDirectories(networkPath);
    if (nodeDirs.length === 0) {
      return { running: false, healthy: false, nodeCount: 0 };
    }

    const firstNodeDir = nodeDirs[0]!;
    const firstNodePath = join(networkPath, firstNodeDir);
    const nodeConfig = loadNodeConfig(firstNodePath);
    if (!nodeConfig) {
      return { running: false, healthy: false, nodeCount: 0 };
    }

    const uri = `http://127.0.0.1:${nodeConfig.httpPort}`;
    const health = await checkNodeHealth(uri, true);

    if (health.healthy) {
      return { running: true, healthy: true, nodeCount: nodeDirs.length };
    }
    return { running: false, healthy: false, nodeCount: 0 };
  }

  // --------------------------------------------------------------------------
  // L1 Node Operations
  // --------------------------------------------------------------------------

  async addL1Node(subnetId: string, onProgress?: (message: string) => void): Promise<CommandOutput<NodeInfo>> {
    return addL1NodeOp(
      getCurrentNetworkName(),
      subnetId,
      this.avalanchegoPath,
      this.pluginDir,
      (options) => this.getStatus(options),
      (p) => this.ensureAvalanchego(p),
      onProgress
    );
  }

  async configureL1Node(
    nodeId: string,
    subnetId: string,
    onProgress?: (message: string) => void
  ): Promise<CommandOutput<NodeInfo>> {
    return configureL1NodeOp(
      getCurrentNetworkName(),
      nodeId,
      subnetId,
      this.pluginDir,
      (options) => this.getStatus(options),
      (p) => this.ensureAvalanchego(p),
      onProgress
    );
  }

  async restartL1Node(subnetId: string, onProgress?: (message: string) => void): Promise<CommandOutput<NodeInfo>> {
    return restartL1NodeOp(
      getCurrentNetworkName(),
      subnetId,
      this.pluginDir,
      (options) => this.getStatus(options),
      (p) => this.ensureAvalanchego(p),
      onProgress
    );
  }

  async restartNodeById(
    nodeId: string,
    clearDatabase = false,
    onProgress?: (message: string) => void
  ): Promise<CommandOutput<NodeInfo>> {
    return restartNodeByIdOp(
      getCurrentNetworkName(),
      nodeId,
      this.pluginDir,
      (options) => this.getStatus(options),
      (p) => this.ensureAvalanchego(p),
      clearDatabase,
      onProgress
    );
  }

  async stopNodeById(
    nodeId: string,
    onProgress?: (message: string) => void
  ): Promise<CommandOutput<{ nodeId: string; stopped: boolean }>> {
    return stopNodeByIdOp(getCurrentNetworkName(), nodeId, onProgress);
  }

  // --------------------------------------------------------------------------
  // Legacy aliases (kept for parity with avalanche-ai's surface)
  // --------------------------------------------------------------------------

  async createSession(name: string, nodeCount = 1, onProgress?: (message: string) => void) {
    return this.createNetwork(name, nodeCount, onProgress);
  }

  async switchSession(name: string, onProgress?: (message: string) => void) {
    return this.switchNetwork(name, onProgress);
  }

  listSessions() {
    return this.listNetworks().map((n) => ({ name: n.name, path: n.path, isActive: n.isActive }));
  }

  async deleteSession(name: string) {
    return this.deleteNetwork(name);
  }

  getCurrentSession(): string | null {
    return getCurrentNetworkName();
  }

  async startNetwork(nodeCount = 1, onProgress?: (message: string) => void) {
    const existing = this.listNetworks();
    if (existing.length > 0 && existing[0]?.isActive) {
      return this.switchNetwork(existing[0].name, onProgress);
    }
    return this.createNetwork("default", nodeCount, onProgress);
  }

  getNetworkDir(): string | null {
    const current = getCurrentNetworkName();
    return current ? join(NETWORKS_DIR, current) : null;
  }

  async newNetwork(nodeCount = 1, onProgress?: (message: string) => void) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    return this.createNetwork(timestamp, nodeCount, onProgress);
  }

  async createL1Node(subnetId: string, onProgress?: (message: string) => void) {
    return this.addL1Node(subnetId, onProgress);
  }

  async createPrimaryNode(_onProgress?: (message: string) => void) {
    return {
      success: false,
      error: { code: "INVALID_ARGS", message: "Use createNetwork to create primary network nodes" },
    } as CommandOutput<NodeInfo>;
  }

  /** Reset module state and forget the current network. */
  forgetCurrentNetwork(): void {
    setCurrentNetworkDir(null);
  }

  // --------------------------------------------------------------------------
  // Private
  // --------------------------------------------------------------------------

  private async ensureAvalanchego(onProgress?: (message: string) => void): Promise<string | null> {
    if (this.avalanchegoPath && existsSync(this.avalanchegoPath)) {
      return this.avalanchegoPath;
    }

    const commonPaths = [
      join(process.env.HOME || "", ".avalanche-cli", "bin", "v1.14.0", "avalanchego"),
      join(process.env.HOME || "", "go/src/github.com/ava-labs/avalanchego/build/avalanchego"),
      "/usr/local/bin/avalanchego",
    ];

    for (const path of commonPaths) {
      if (existsSync(path)) {
        this.avalanchegoPath = path;
        setCachedAvalanchegoPath(path);
        return path;
      }
    }

    try {
      onProgress?.("avalanchego not found, downloading...");
      const path = await ensureAvalanchego(onProgress);
      this.avalanchegoPath = path;
      return path;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to download avalanchego: ${message}. Tried paths: ${commonPaths.join(", ")}`);
      return null;
    }
  }
}
