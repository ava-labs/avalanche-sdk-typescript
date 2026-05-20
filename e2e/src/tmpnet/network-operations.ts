/**
 * Network Operations
 *
 * Network lifecycle: create, switch, restart nodes.  Ported from avalanche-ai,
 * with one structural change: instead of relying on a DI'd ConfigService to
 * remember the active network, we keep a module-level `currentNetworkName`
 * variable that lives for the life of the process, with a filesystem fallback
 * (existing `default` dir or `latest` symlink).
 */

import type { Subprocess } from "bun";
import { existsSync, realpathSync, rmSync } from "fs";
import { join } from "path";

import { mkdirSecure, writeFileSecure } from "../utils/fs-secure.ts";
import { logger } from "../utils/logger.ts";
import type { CommandOutput } from "../utils/types.ts";
import { NETWORKS_DIR, NODE_PARALLEL_STARTUP_TIMEOUT, NODE_STARTUP_TIMEOUT } from "./constants.ts";
import { withGlobalLock, withNetworkLock } from "./lock.ts";
import { finalizeNode, getNodeDirectories, startNewNode } from "./node-operations.ts";
import {
  gracefulKill,
  killProcessesOnPorts,
  killTrackedProcesses,
  safeProgress,
  setNodeProcesses,
  waitForNode,
  waitForNodeBootstrapped,
} from "./process.ts";
import type { NetworkConfig, NodeInfo } from "./types.ts";

// ----------------------------------------------------------------------------
// Active-network tracking (replaces avalanche-ai's ConfigService dependency)
// ----------------------------------------------------------------------------

let currentNetworkDir: string | null = null;

/** Set the active network directory.  Called by create/restart/switch. */
function setCurrentNetworkDir(dir: string | null): void {
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

/** Update the `latest` symlink to point at `networkPath`. */
async function updateLatestSymlink(networkPath: string): Promise<void> {
  const latestPath = join(NETWORKS_DIR, "latest");
  try {
    if (existsSync(latestPath)) rmSync(latestPath);
    await Bun.$`ln -s ${networkPath} ${latestPath}`.quiet().nothrow();
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logger.warn(`Failed to update latest symlink from ${latestPath} to ${networkPath}: ${message}`);
  }
}
