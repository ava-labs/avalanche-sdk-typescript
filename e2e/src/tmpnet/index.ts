/**
 * Tmpnet Manager — minimal driver for local Avalanche e2e tests.
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
 *           db/ logs/ chainData/
 *         subnets/                # Subnet configurations
 *       latest -> <network-name>  # Symlink to most recent network
 *
 * Ported from avalanche-ai with DI stripped and pruned to the surface this
 * package's e2e tests use (createNetwork, addL1Node, stopNetwork, dispose).
 */

import { existsSync } from "fs";
import { join } from "path";

import { ensureAvalanchego, getCachedAvalanchegoPath, setCachedAvalanchegoPath } from "../avalanchego.ts";
import { logger } from "../utils/logger.ts";
import type { CommandOutput, IDisposable } from "../utils/types.ts";
import { NETWORKS_DIR, PLUGIN_DIR, STAKING_KEYS_DIR } from "./constants.ts";
import { addL1Node as addL1NodeOp } from "./l1-operations.ts";
import { AsyncMutex } from "./lock.ts";
import {
  createNetwork as createNetworkOp,
  getCurrentNetworkName,
  stopNetwork as stopNetworkOp,
} from "./network-operations.ts";
import { getNodeDirectories, loadNodeConfig } from "./node-operations.ts";
import { checkNodeHealth } from "./process.ts";
import type { NetworkStatus, NodeInfo } from "./types.ts";

export * from "./constants.ts";
export * from "./types.ts";

export interface TmpnetManagerConfig {
  /** Override the avalanchego binary path (defaults to discovering one). */
  avalanchegoPath?: string;
  /** Override the plugin directory. */
  pluginDir?: string;
  /** Override the staking keys directory. */
  stakingKeysDir?: string;
}

/**
 * Manages a local tmpnet AvalancheGo network for e2e tests.
 */
export class TmpnetManager implements IDisposable {
  private avalanchegoPath: string;
  private readonly stakingKeysDir: string;
  private readonly pluginDir: string;
  /** Serializes state-changing operations (createNetwork / stopNetwork). */
  private readonly mutex = new AsyncMutex();

  constructor(config: TmpnetManagerConfig = {}) {
    this.avalanchegoPath = config.avalanchegoPath ?? getCachedAvalanchegoPath() ?? "";
    this.stakingKeysDir = config.stakingKeysDir ?? STAKING_KEYS_DIR;
    this.pluginDir = config.pluginDir ?? PLUGIN_DIR;
    if (this.avalanchegoPath) {
      setCachedAvalanchegoPath(this.avalanchegoPath);
    }
  }

  /** Stop the network. Best-effort, never throws. */
  async dispose(): Promise<void> {
    try {
      await stopNetworkOp();
    } catch (error) {
      logger.fileError(
        `Error during TmpnetManager disposal: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async createNetwork(
    name: string,
    nodeCount = 1,
    onProgress?: (message: string) => void,
  ): Promise<CommandOutput<{ networkDir: string; nodes: NodeInfo[] }>> {
    return this.mutex.withLock(async () => {
      try {
        await stopNetworkOp();
        const avalanchego = await this.ensureAvalanchego(onProgress);
        if (!avalanchego) {
          return {
            success: false,
            error: { code: "DOWNLOAD_FAILED", message: "Failed to find or download avalanchego" },
          };
        }
        return createNetworkOp(name, nodeCount, avalanchego, this.pluginDir, onProgress);
      } catch (err) {
        const msg = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
        return {
          success: false,
          error: { code: "EXECUTION_ERROR", message: `createNetwork crashed: ${msg}` },
        };
      }
    });
  }

  async stopNetwork(): Promise<CommandOutput<void>> {
    return this.mutex.withLock(() => stopNetworkOp());
  }

  async addL1Node(
    subnetId: string,
    onProgress?: (message: string) => void,
  ): Promise<CommandOutput<NodeInfo>> {
    return addL1NodeOp(
      getCurrentNetworkName(),
      subnetId,
      this.avalanchegoPath,
      this.pluginDir,
      (options) => this.getStatus(options),
      (p) => this.ensureAvalanchego(p),
      onProgress,
    );
  }

  /**
   * Snapshot of healthy nodes in the current network. Used as an addL1Node
   * callback to enumerate existing primary-network nodes the L1 should
   * bootstrap from.
   */
  async getStatus(options?: { primaryNetworkOnly?: boolean }): Promise<CommandOutput<NetworkStatus>> {
    const currentNetwork = getCurrentNetworkName();
    if (!currentNetwork) {
      return { success: true, data: { running: false, nodes: [] } };
    }

    const networkPath = join(NETWORKS_DIR, currentNetwork);
    const healthChecks = getNodeDirectories(networkPath).map(async (nodeDir) => {
      const nodeConfig = loadNodeConfig(join(networkPath, nodeDir));
      if (!nodeConfig) return null;

      const uri = `http://127.0.0.1:${nodeConfig.httpPort}`;
      const health = await checkNodeHealth(uri, false, options);
      if (!health.healthy || !health.nodeId) return null;

      return {
        nodeId: health.nodeId,
        uri,
        stakingAddress: `127.0.0.1:${nodeConfig.stakingPort}`,
        isValidator: nodeConfig.isValidator,
        uptime: 1,
        trackedSubnets: nodeConfig.trackedSubnets,
      } as NodeInfo;
    });

    const nodes = (await Promise.all(healthChecks)).filter((n): n is NodeInfo => n !== null);
    return {
      success: true,
      data: { running: nodes.length > 0, nodes, networkName: currentNetwork },
    };
  }

  private async ensureAvalanchego(onProgress?: (message: string) => void): Promise<string | null> {
    if (this.avalanchegoPath && existsSync(this.avalanchegoPath)) return this.avalanchegoPath;

    // Common install locations checked before falling back to a download.
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
      const msg = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to download avalanchego: ${msg}. Tried paths: ${commonPaths.join(", ")}`);
      return null;
    }
  }
}
