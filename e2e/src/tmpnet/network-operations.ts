/**
 * Network Operations
 *
 * Network lifecycle: create, switch, restart nodes.  Ported from avalanche-ai,
 * with one structural change: instead of relying on a DI'd ConfigService to
 * remember the active network, we keep a module-level `currentNetworkName`
 * variable that lives for the life of the process, with a filesystem fallback
 * (existing `default` dir or `latest` symlink).
 */

import { existsSync, readFileSync, readdirSync, realpathSync, rmSync } from "fs";
import { join } from "path";
import type { Subprocess } from "bun";

import { logger } from "../utils/logger.ts";
import type { CommandOutput } from "../utils/types.ts";
import { TmpnetNetworkConfigSchema, safeJsonParse } from "../utils/validation.ts";
import type { NetworkConfig, NetworkListEntry, NodeConfigEntry, NodeInfo } from "./types.ts";

import { mkdirSecure, writeFileSecure } from "../utils/fs-secure.ts";
import { NETWORKS_DIR, NODE_PARALLEL_STARTUP_TIMEOUT, NODE_STARTUP_TIMEOUT } from "./constants.ts";
import { withGlobalLock, withNetworkLock } from "./lock.ts";
import {
  cleanupTempDirectories,
  finalizeNode,
  getNodeDirectories,
  loadNodeConfig,
  startExistingNode,
  startNewNode,
} from "./node-operations.ts";
import {
  areNodesAlreadyRunning,
  checkNodeHealth,
  gracefulKill,
  killProcessesOnPorts,
  killTrackedProcesses,
  safeProgress,
  setNodeProcesses,
  waitForNode,
  waitForNodeBootstrapped,
} from "./process.ts";

// ----------------------------------------------------------------------------
// Active-network tracking (replaces avalanche-ai's ConfigService dependency)
// ----------------------------------------------------------------------------

let currentNetworkDir: string | null = null;

/** Set the active network directory.  Called by create/restart/switch. */
export function setCurrentNetworkDir(dir: string | null): void {
  currentNetworkDir = dir;
}

interface NodeStartResult {
  proc: Subprocess;
  nodeInfo: NodeInfo;
}

/**
 * Create a new network and start it.
 * Uses global lock to prevent concurrent creates.
 */
export async function createNetwork(
  name: string,
  nodeCount: number,
  avalanchego: string,
  pluginDir: string,
  onProgress?: (message: string) => void
): Promise<CommandOutput<{ networkDir: string; nodes: NodeInfo[] }>> {
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    return {
      success: false,
      error: { code: "INVALID_NAME", message: "Network name must be alphanumeric with hyphens/underscores only" },
    };
  }

  return withGlobalLock(
    async () => {
      const networkPath = join(NETWORKS_DIR, name);
      const configPath = join(networkPath, "config.json");

      if (existsSync(networkPath)) {
        if (existsSync(configPath)) {
          return {
            success: false,
            error: {
              code: "VALIDATION_FAILED",
              message: `Network '${name}' already exists. Use 'switch' to switch to it or 'delete' to remove it.`,
            },
          };
        }
        onProgress?.(`cleaning up stale network directory '${name}'...`);
        try {
          rmSync(networkPath, { recursive: true, force: true });
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          return {
            success: false,
            error: { code: "EXECUTION_ERROR", message: `Failed to clean up stale directory for '${name}': ${errMsg}` },
          };
        }
      }

      onProgress?.(`creating network '${name}'...`);

      mkdirSecure(networkPath, { recursive: true });
      mkdirSecure(join(networkPath, "subnets"), { recursive: true });

      const uuid = crypto.randomUUID();
      const config: NetworkConfig = {
        uuid,
        created: new Date().toISOString(),
        avalanchegoPath: avalanchego,
        nodeCount,
      };
      writeFileSecure(join(networkPath, "config.json"), JSON.stringify(config, null, 2));
      writeFileSecure(join(networkPath, "network.env"), `export TMPNET_NETWORK_DIR="${networkPath}"\n`);

      await updateLatestSymlink(networkPath);

      return startNetworkNodes(avalanchego, networkPath, nodeCount, pluginDir, onProgress);
    },
    { operation: `createNetwork:${name}` }
  );
}

/** Attach to an already-running network. */
export async function attachToRunningNetwork(
  networkPath: string,
  onProgress?: (message: string) => void
): Promise<CommandOutput<{ networkDir: string; nodes: NodeInfo[] }>> {
  const nodeDirs = getNodeDirectories(networkPath);
  if (nodeDirs.length === 0) {
    return { success: false, error: { code: "NO_NODES", message: "No nodes found in network" } };
  }

  const healthChecks = nodeDirs.map(async (dir) => {
    const config = loadNodeConfig(join(networkPath, dir));
    if (!config) return null;
    const health = await checkNodeHealth(`http://127.0.0.1:${config.httpPort}`, true);
    if (health.healthy) {
      return {
        nodeId: config.nodeId,
        uri: `http://127.0.0.1:${config.httpPort}`,
        stakingAddress: `127.0.0.1:${config.stakingPort}`,
        isValidator: config.isValidator,
        trackedSubnets: config.trackedSubnets,
      } as NodeInfo;
    }
    return null;
  });

  const results = await Promise.all(healthChecks);
  const nodes = results.filter((n): n is NodeInfo => n !== null);

  if (nodes.length === 0) {
    return { success: false, error: { code: "NODE_NOT_HEALTHY", message: "No healthy nodes found" } };
  }

  safeProgress(onProgress, `attached to ${nodes.length} running nodes`);
  setCurrentNetworkDir(networkPath);

  return { success: true, data: { networkDir: networkPath, nodes } };
}

/** Restart existing network nodes (or attach if already running). */
export async function restartExistingNodes(
  avalanchego: string,
  networkPath: string,
  pluginDir: string,
  onProgress?: (message: string) => void
): Promise<CommandOutput<{ networkDir: string; nodes: NodeInfo[] }>> {
  const networkName = networkPath.split("/").pop() || "unknown";

  return withNetworkLock(
    networkName,
    async () => {
      cleanupTempDirectories(networkPath);

      const nodeDirs = getNodeDirectories(networkPath);
      if (nodeDirs.length === 0) {
        return { success: false, error: { code: "NO_NODES", message: "No nodes found in network" } };
      }

      const allConfigs: NodeConfigEntry[] = [];
      const validatorConfigs: NodeConfigEntry[] = [];
      const l1NodeConfigs: NodeConfigEntry[] = [];

      for (const dir of nodeDirs) {
        const config = loadNodeConfig(join(networkPath, dir));
        if (!config) continue;
        allConfigs.push({ dir, config });
        if (config.isValidator) validatorConfigs.push({ dir, config });
        else if (config.trackedSubnets && config.trackedSubnets.length > 0) l1NodeConfigs.push({ dir, config });
      }

      validatorConfigs.sort((a, b) => a.config.httpPort - b.config.httpPort);

      if (validatorConfigs.length === 0) {
        return { success: false, error: { code: "NO_NODES", message: "No validator nodes found" } };
      }

      const runningStatus = await areNodesAlreadyRunning(allConfigs.map((c) => ({ httpPort: c.config.httpPort })));

      if (runningStatus.running) {
        safeProgress(onProgress, `network already running (${runningStatus.healthyCount} healthy nodes)`);
        return attachToRunningNetwork(networkPath, onProgress);
      }

      safeProgress(onProgress, "network not running, starting nodes...");

      await killProcessesOnPorts();

      const nodes: NodeInfo[] = [];
      const procs: Subprocess[] = [];

      const node0 = validatorConfigs[0]!;
      safeProgress(onProgress, "starting bootstrap node...");
      const node0Proc = startExistingNode(avalanchego, networkPath, node0.dir, node0.config, pluginDir);
      if (!node0Proc) {
        return { success: false, error: { code: "NODE_START_FAILED", message: "Failed to start bootstrap node" } };
      }
      procs.push(node0Proc);

      const node0Result = await waitForNode(node0.config.httpPort, NODE_STARTUP_TIMEOUT);
      if (!node0Result.success) {
        await cleanupProcessesOnFailure(procs, "restart bootstrap node");
        return {
          success: false,
          error: { code: "NODE_NOT_HEALTHY", message: "Bootstrap node failed to become healthy" },
        };
      }

      nodes.push({
        nodeId: node0.config.nodeId,
        uri: `http://127.0.0.1:${node0.config.httpPort}`,
        stakingAddress: `127.0.0.1:${node0.config.stakingPort}`,
        isValidator: true,
      });
      safeProgress(onProgress, `node0 ready: ${node0.config.nodeId}`);

      safeProgress(onProgress, "waiting for chains to bootstrap...");
      const bootstrapResult = await waitForNodeBootstrapped(node0.config.httpPort, 60, onProgress);
      if (!bootstrapResult.success) {
        safeProgress(onProgress, "warning: bootstrap node chains may not be fully ready");
      } else {
        safeProgress(onProgress, "bootstrap node chains ready");
      }

      const remainingValidators = validatorConfigs.slice(1);
      const totalRemaining = remainingValidators.length + l1NodeConfigs.length;

      if (totalRemaining > 0) {
        const validatorCount = remainingValidators.length;
        const l1Count = l1NodeConfigs.length;
        safeProgress(
          onProgress,
          l1Count > 0
            ? `starting ${validatorCount} validators + ${l1Count} L1 nodes...`
            : `starting ${validatorCount} validators...`
        );

        const validatorPromises: Promise<NodeStartResult | null>[] = remainingValidators.map(({ dir, config }) =>
          (async (): Promise<NodeStartResult | null> => {
            const proc = startExistingNode(avalanchego, networkPath, dir, config, pluginDir, node0.config.nodeId);
            if (!proc) return null;
            const result = await waitForNode(config.httpPort, NODE_PARALLEL_STARTUP_TIMEOUT);
            if (!result.success) {
              if (proc.pid) await gracefulKill(proc.pid, 5000);
              return null;
            }
            return {
              proc,
              nodeInfo: {
                nodeId: config.nodeId,
                uri: `http://127.0.0.1:${config.httpPort}`,
                stakingAddress: `127.0.0.1:${config.stakingPort}`,
                isValidator: true,
              },
            };
          })()
        );

        const l1Promises: Promise<NodeStartResult | null>[] = l1NodeConfigs.map(({ dir, config }) =>
          (async (): Promise<NodeStartResult | null> => {
            const proc = startExistingNode(avalanchego, networkPath, dir, config, pluginDir, node0.config.nodeId);
            if (!proc) return null;
            const result = await waitForNode(config.httpPort, NODE_PARALLEL_STARTUP_TIMEOUT);
            if (!result.success) {
              if (proc.pid) await gracefulKill(proc.pid, 5000);
              return null;
            }
            return {
              proc,
              nodeInfo: {
                nodeId: config.nodeId,
                uri: `http://127.0.0.1:${config.httpPort}`,
                stakingAddress: `127.0.0.1:${config.stakingPort}`,
                isValidator: false,
                trackedSubnets: config.trackedSubnets,
              },
            };
          })()
        );

        const allResults = await Promise.allSettled([...validatorPromises, ...l1Promises]);

        const successResults: NodeStartResult[] = [];
        let failedCount = 0;
        for (const result of allResults) {
          if (result.status === "fulfilled" && result.value !== null) successResults.push(result.value);
          else failedCount++;
        }

        if (failedCount > 0) {
          const allProcs = [node0Proc, ...successResults.map((r) => r.proc)];
          await cleanupProcessesOnFailure(allProcs, "partial node restart failure");
          return {
            success: false,
            error: {
              code: "NODE_START_FAILED",
              message: `${failedCount} of ${totalRemaining} nodes failed to start. Network restart aborted.`,
            },
          };
        }

        for (const result of successResults) {
          nodes.push(result.nodeInfo);
          procs.push(result.proc);
        }

        const readyValidators = nodes.filter((n) => n.isValidator).length;
        const readyL1 = nodes.filter((n) => !n.isValidator).length;
        if (readyL1 > 0) safeProgress(onProgress, `${readyValidators} validators + ${readyL1} L1 nodes ready`);
        else safeProgress(onProgress, `${readyValidators} validators ready`);
      }

      setNodeProcesses(procs);
      setCurrentNetworkDir(networkPath);

      return { success: true, data: { networkDir: networkPath, nodes } };
    },
    { operation: `restartNodes:${networkName}` }
  );
}

async function cleanupProcessesOnFailure(procs: Subprocess[], context: string): Promise<void> {
  const killPromises = procs.map(async (proc) => {
    try {
      if (proc.pid) {
        const killed = await gracefulKill(proc.pid, 5000);
        if (!killed) logger.warn(`Failed to kill process (PID ${proc.pid}) during ${context}`);
      } else {
        proc.kill();
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      logger.warn(`Exception while killing process (PID ${proc.pid}) during ${context}: ${message}`);
    }
  });
  await Promise.allSettled(killPromises);
}

/** Start a fresh validator set for a new network. */
export async function startNetworkNodes(
  avalanchego: string,
  networkPath: string,
  nodeCount: number,
  pluginDir: string,
  onProgress?: (message: string) => void
): Promise<CommandOutput<{ networkDir: string; nodes: NodeInfo[] }>> {
  const nodes: NodeInfo[] = [];
  const procs: Subprocess[] = [];
  const validatorCount = Math.max(nodeCount, 1);

  safeProgress(onProgress, "starting bootstrap node (node0)...");
  const node0 = await startNewNode(avalanchego, networkPath, 0, pluginDir);
  procs.push(node0.proc);

  const waitStart = Date.now();
  const node0Result = await waitForNode(node0.httpPort, NODE_STARTUP_TIMEOUT);
  if (!node0Result.success || !node0Result.nodeId) {
    await cleanupProcessesOnFailure(procs, "bootstrap node startup");
    return { success: false, error: { code: "NODE_START_FAILED", message: "Bootstrap node failed to start" } };
  }

  const node0Info = await finalizeNode(
    node0.proc,
    node0.tempDir,
    networkPath,
    node0.httpPort,
    node0.stakingPort,
    node0.stakerNum,
    node0Result.nodeId
  );
  nodes.push(node0Info);
  const waitTime = ((Date.now() - waitStart) / 1000).toFixed(1);
  safeProgress(onProgress, `node0 ready: ${node0Result.nodeId} (${waitTime}s)`);

  safeProgress(onProgress, "waiting for chains to bootstrap...");
  const bootstrapResult = await waitForNodeBootstrapped(node0.httpPort, 60, onProgress);
  if (!bootstrapResult.success) {
    safeProgress(onProgress, "warning: bootstrap node chains may not be fully ready");
  } else {
    safeProgress(onProgress, "bootstrap node chains ready");
  }

  if (validatorCount > 1) {
    safeProgress(onProgress, `starting nodes 1-${validatorCount - 1} in parallel...`);
    const parallelStart = Date.now();

    const nodePromises: Promise<NodeStartResult | null>[] = [];
    for (let i = 1; i < validatorCount; i++) {
      nodePromises.push(
        (async (): Promise<NodeStartResult | null> => {
          const nodeData = await startNewNode(avalanchego, networkPath, i, pluginDir, node0Result.nodeId);
          const result = await waitForNode(nodeData.httpPort, NODE_PARALLEL_STARTUP_TIMEOUT);
          if (result.success && result.nodeId) {
            const nodeInfo = await finalizeNode(
              nodeData.proc,
              nodeData.tempDir,
              networkPath,
              nodeData.httpPort,
              nodeData.stakingPort,
              nodeData.stakerNum,
              result.nodeId
            );
            return { proc: nodeData.proc, nodeInfo };
          }
          if (nodeData.proc.pid) await gracefulKill(nodeData.proc.pid, 5000);
          return null;
        })()
      );
    }

    const allResults = await Promise.allSettled(nodePromises);

    const successResults: NodeStartResult[] = [];
    let failedCount = 0;
    for (const result of allResults) {
      if (result.status === "fulfilled" && result.value !== null) successResults.push(result.value);
      else failedCount++;
    }

    if (failedCount > 0) {
      const allProcs = [node0.proc, ...successResults.map((r) => r.proc)];
      await cleanupProcessesOnFailure(allProcs, "partial node startup failure");
      return {
        success: false,
        error: {
          code: "NODE_START_FAILED",
          message: `${failedCount} of ${validatorCount - 1} nodes failed to start. Network creation aborted.`,
        },
      };
    }

    for (const result of successResults) {
      nodes.push(result.nodeInfo);
      procs.push(result.proc);
    }

    const parallelTime = ((Date.now() - parallelStart) / 1000).toFixed(1);
    safeProgress(onProgress, `${nodes.length - 1} additional validators ready (${parallelTime}s)`);
  }

  setNodeProcesses(procs);
  setCurrentNetworkDir(networkPath);

  return { success: true, data: { networkDir: networkPath, nodes } };
}

export function listNetworks(): NetworkListEntry[] {
  const networks: NetworkListEntry[] = [];
  const currentNetwork = getCurrentNetworkName();

  if (!existsSync(NETWORKS_DIR)) return networks;

  try {
    const entries = readdirSync(NETWORKS_DIR);
    for (const entry of entries) {
      if (entry === "latest") continue;
      const networkPath = join(NETWORKS_DIR, entry);
      const configPath = join(networkPath, "config.json");

      if (existsSync(configPath)) {
        try {
          const content = readFileSync(configPath, "utf-8");
          const config = safeJsonParse(content, TmpnetNetworkConfigSchema, configPath);
          if (config) {
            networks.push({
              name: entry,
              path: networkPath,
              isActive: currentNetwork === entry,
              created: config.created,
            });
          } else {
            networks.push({ name: entry, path: networkPath, isActive: currentNetwork === entry });
          }
        } catch (e) {
          const message = e instanceof Error ? e.message : String(e);
          logger.warn(`Failed to parse config for network ${entry} at ${configPath}: ${message}`);
          networks.push({ name: entry, path: networkPath, isActive: currentNetwork === entry });
        }
      }
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logger.warn(`Failed to list networks directory at ${NETWORKS_DIR}: ${message}`);
  }

  networks.sort((a, b) => {
    if (a.created && b.created) return new Date(b.created).getTime() - new Date(a.created).getTime();
    return 0;
  });

  return networks;
}

export async function deleteNetwork(name: string): Promise<CommandOutput<void>> {
  const networkPath = join(NETWORKS_DIR, name);

  if (!existsSync(networkPath)) {
    return { success: false, error: { code: "NOT_FOUND", message: `Network '${name}' does not exist` } };
  }

  return withNetworkLock(
    name,
    async () => {
      const currentNetwork = getCurrentNetworkName();
      const isActive = currentNetwork === name;

      await stopNetworkInternal();

      if (isActive) setCurrentNetworkDir(null);

      try {
        rmSync(networkPath, { recursive: true, force: true });
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: {
            code: "EXECUTION_ERROR",
            message: `Failed to delete: ${error instanceof Error ? error.message : "unknown"}`,
          },
        };
      }
    },
    { operation: `deleteNetwork:${name}` }
  );
}

async function stopNetworkInternal(): Promise<CommandOutput<void>> {
  await killTrackedProcesses();
  await killProcessesOnPorts();
  return { success: true };
}

export async function stopNetwork(): Promise<CommandOutput<void>> {
  return withGlobalLock(async () => stopNetworkInternal(), { operation: "stopNetwork" });
}

/**
 * Get the name of the currently-active network.  Order of resolution:
 *   1. In-memory `currentNetworkDir` set by create/restart/switch
 *   2. `default` network directory (legacy fallback)
 *   3. `latest` symlink under NETWORKS_DIR
 */
export function getCurrentNetworkName(): string | null {
  if (currentNetworkDir) {
    const parts = currentNetworkDir.split("/");
    return parts[parts.length - 1] ?? null;
  }

  const defaultNetworkPath = join(NETWORKS_DIR, "default");
  if (existsSync(join(defaultNetworkPath, "config.json"))) {
    currentNetworkDir = defaultNetworkPath;
    return "default";
  }

  const latestPath = join(NETWORKS_DIR, "latest");
  if (existsSync(latestPath)) {
    try {
      const realPath = realpathSync(latestPath);
      if (existsSync(join(realPath, "config.json"))) {
        currentNetworkDir = realPath;
        return realPath.split("/").pop() ?? null;
      }
    } catch (e) {
      logger.fileDebug(`getCurrentNetworkName: failed to resolve 'latest' symlink: ${e}`);
    }
  }

  return null;
}

/** Get the active network's directory (or null). */
export function getCurrentNetworkDir(): string | null {
  return currentNetworkDir;
}

/** Update the `latest` symlink to point at `networkPath`. */
export async function updateLatestSymlink(networkPath: string): Promise<void> {
  const latestPath = join(NETWORKS_DIR, "latest");
  try {
    if (existsSync(latestPath)) rmSync(latestPath);
    await Bun.$`ln -s ${networkPath} ${latestPath}`.quiet().nothrow();
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logger.warn(`Failed to update latest symlink from ${latestPath} to ${networkPath}: ${message}`);
  }
}
