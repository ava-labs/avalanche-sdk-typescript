/**
 * L1 Node Operations
 *
 * Operations for managing L1 validator nodes within a tmpnet.  Ported from
 * avalanche-ai with DI / ConfigService dependencies stripped.
 */

import { existsSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { spawn } from "bun";
import { ensureExecutable } from "../utils/fs-secure.ts";
import { logger } from "../utils/logger.ts";

import type { CommandOutput } from "../utils/types.ts";
import type { NodeConfig, NodeInfo, ProcessDetails } from "./types.ts";

import { NETWORKS_DIR, NODE_RESTART_WAIT } from "./constants.ts";
import { withNetworkLock } from "./lock.ts";
import {
  addBootstrapArgs,
  addStakingKeyArgs,
  buildBaseNodeArgs,
  getNodeDirectories,
  loadNodeConfig,
  saveNodeConfig,
  saveProcessDetails,
  startL1Node,
} from "./node-operations.ts";
import {
  addNodeProcess,
  getStakerNumFromPort,
  killAvalanchegoOnPort,
  killProcessesOnPorts,
  safeProgress,
  waitForNode,
} from "./process.ts";

/**
 * Add an L1 validator node to the network.
 */
export async function addL1Node(
  networkName: string | null,
  subnetId: string,
  _avalanchegoPath: string | null,
  pluginDir: string,
  getStatus: (options?: { primaryNetworkOnly?: boolean }) => Promise<
    CommandOutput<{ running: boolean; nodes: NodeInfo[] }>
  >,
  ensureAvalanchego: (onProgress?: (message: string) => void) => Promise<string | null>,
  onProgress?: (message: string) => void
): Promise<CommandOutput<NodeInfo>> {
  if (!networkName) {
    return { success: false, error: { code: "TMPNET_NOT_RUNNING", message: "No active network. Create one first." } };
  }

  return withNetworkLock(
    networkName,
    async () => {
      const networkPath = join(NETWORKS_DIR, networkName);
      let status = await getStatus();

      if (!status.success || !status.data?.running) {
        safeProgress(onProgress, "waiting for network health to stabilize...");
        await Bun.sleep(2000);
        status = await getStatus({ primaryNetworkOnly: true });
      }

      if (!status.success || !status.data?.running) {
        return { success: false, error: { code: "TMPNET_NOT_RUNNING", message: "Network is not running" } };
      }

      const bootstrapNode = status.data.nodes[0];
      if (!bootstrapNode) {
        return { success: false, error: { code: "NO_NODES", message: "No bootstrap node found" } };
      }

      const avalanchego = await ensureAvalanchego(onProgress);
      if (!avalanchego) {
        return { success: false, error: { code: "DOWNLOAD_FAILED", message: "Failed to find avalanchego" } };
      }

      const existingNodes = getNodeDirectories(networkPath);
      const nodeNum = existingNodes.length;

      const result = await startL1Node(
        avalanchego,
        networkPath,
        nodeNum,
        subnetId,
        bootstrapNode,
        pluginDir,
        onProgress
      );

      if (!result.success || !result.nodeInfo) {
        return {
          success: false,
          error: { code: "NODE_START_FAILED", message: result.error || "Failed to start L1 node" },
        };
      }

      return { success: true, data: result.nodeInfo };
    },
    { operation: `addL1Node:${networkName}:${subnetId}` }
  );
}

/**
 * Configure a node to track a subnet by restarting it.
 */
export async function configureL1Node(
  networkName: string | null,
  nodeId: string,
  subnetId: string,
  pluginDir: string,
  getStatus: (options?: { primaryNetworkOnly?: boolean }) => Promise<
    CommandOutput<{ running: boolean; nodes: NodeInfo[] }>
  >,
  ensureAvalanchego: (onProgress?: (message: string) => void) => Promise<string | null>,
  onProgress?: (message: string) => void
): Promise<CommandOutput<NodeInfo>> {
  logger.file(`[configureL1Node] START nodeId=${nodeId}, subnetId=${subnetId}`);

  if (!networkName) {
    logger.fileError("[configureL1Node] No active network");
    return { success: false, error: { code: "TMPNET_NOT_RUNNING", message: "No active network" } };
  }

  return withNetworkLock(
    networkName,
    async () => {
      const networkPath = join(NETWORKS_DIR, networkName);
      const nodeDir = join(networkPath, nodeId);
      logger.file(`[configureL1Node] nodeDir=${nodeDir}`);

      if (!existsSync(nodeDir)) {
        return { success: false, error: { code: "NOT_FOUND", message: `Node ${nodeId} not found` } };
      }

      const nodeConfig = loadNodeConfig(nodeDir);
      if (!nodeConfig) {
        return { success: false, error: { code: "NOT_FOUND", message: "Node config not found" } };
      }

      safeProgress(onProgress, "restarting node to track subnet...");

      await killAvalanchegoOnPort(nodeConfig.httpPort, logger);
      await Bun.sleep(NODE_RESTART_WAIT);

      const avalanchego = await ensureAvalanchego(onProgress);
      if (!avalanchego) {
        return { success: false, error: { code: "DOWNLOAD_FAILED", message: "Failed to find avalanchego" } };
      }

      const status = await getStatus({ primaryNetworkOnly: true });
      const bootstrapNode = status.data?.nodes.find((n) => n.isValidator);

      const args = buildBaseNodeArgs(nodeConfig.httpPort, nodeConfig.stakingPort, nodeDir, pluginDir);
      args.push(`--track-subnets=${subnetId}`);
      addBootstrapArgs(args, bootstrapNode?.nodeId);

      ensureExecutable(avalanchego);

      const proc = spawn([avalanchego, ...args], {
        cwd: nodeDir,
        stdout: "ignore",
        stderr: "ignore",
        detached: true,
      });
      proc.unref();
      addNodeProcess(proc);

      const result = await waitForNode(nodeConfig.httpPort, 60, onProgress);
      if (!result.success) {
        return {
          success: false,
          error: { code: "NODE_NOT_HEALTHY", message: result.error || "Node failed to restart" },
        };
      }

      nodeConfig.trackedSubnets = [subnetId];
      saveNodeConfig(nodeDir, nodeConfig);

      const processDetails: ProcessDetails = {
        pid: proc.pid,
        apiUri: `http://127.0.0.1:${nodeConfig.httpPort}`,
        stakingAddress: `127.0.0.1:${nodeConfig.stakingPort}`,
      };
      saveProcessDetails(nodeDir, processDetails);

      safeProgress(onProgress, "node now tracking subnet");

      return {
        success: true,
        data: {
          nodeId: nodeConfig.nodeId,
          uri: `http://127.0.0.1:${nodeConfig.httpPort}`,
          stakingAddress: `127.0.0.1:${nodeConfig.stakingPort}`,
          isValidator: false,
          trackedSubnets: [subnetId],
        },
      };
    },
    { operation: `configureL1Node:${networkName}:${nodeId}` }
  );
}

/**
 * Restart a node by its node ID.  Works for L1 and validator nodes.
 */
export async function restartNodeById(
  networkName: string | null,
  nodeId: string,
  pluginDir: string,
  getStatus: (options?: { primaryNetworkOnly?: boolean }) => Promise<
    CommandOutput<{ running: boolean; nodes: NodeInfo[] }>
  >,
  ensureAvalanchego: (onProgress?: (message: string) => void) => Promise<string | null>,
  clearDatabase = false,
  onProgress?: (message: string) => void
): Promise<CommandOutput<NodeInfo>> {
  logger.fileDebug(`[restartNodeById] START nodeId=${nodeId}, clearDatabase=${clearDatabase}`);

  if (!networkName) {
    return { success: false, error: { code: "TMPNET_NOT_RUNNING", message: "No active network" } };
  }

  return withNetworkLock(
    networkName,
    async () => {
      const networkPath = join(NETWORKS_DIR, networkName);
      const nodeDir = join(networkPath, nodeId);

      if (!existsSync(nodeDir)) {
        return { success: false, error: { code: "NOT_FOUND", message: `Node ${nodeId} not found` } };
      }

      const nodeConfig = loadNodeConfig(nodeDir);
      if (!nodeConfig) {
        return { success: false, error: { code: "NOT_FOUND", message: "Node config not found" } };
      }

      onProgress?.(`restarting node ${nodeId}...`);

      await killProcessesOnPorts([nodeConfig.httpPort]);
      await Bun.sleep(NODE_RESTART_WAIT);

      if (clearDatabase) {
        const dbDir = join(nodeDir, "db");
        rmSync(dbDir, { recursive: true, force: true });
        mkdirSync(dbDir, { recursive: true });
      }

      const avalanchego = await ensureAvalanchego(onProgress);
      if (!avalanchego) {
        return { success: false, error: { code: "DOWNLOAD_FAILED", message: "Failed to find avalanchego" } };
      }

      const status = await getStatus({ primaryNetworkOnly: true });
      const bootstrapNode = status.data?.nodes.find((n) => n.isValidator);

      const args = buildBaseNodeArgs(nodeConfig.httpPort, nodeConfig.stakingPort, nodeDir, pluginDir);

      if (nodeConfig.isValidator) {
        const stakerNum = getStakerNumFromPort(nodeConfig.httpPort);
        addStakingKeyArgs(args, stakerNum);
      }

      if (nodeConfig.trackedSubnets && nodeConfig.trackedSubnets.length > 0) {
        args.push(`--track-subnets=${nodeConfig.trackedSubnets.join(",")}`);
      }

      addBootstrapArgs(args, bootstrapNode?.nodeId);
      ensureExecutable(avalanchego);

      const proc = spawn([avalanchego, ...args], {
        cwd: nodeDir,
        stdout: "ignore",
        stderr: "ignore",
        detached: true,
      });
      proc.unref();
      addNodeProcess(proc);

      const result = await waitForNode(nodeConfig.httpPort, 120, onProgress);
      if (!result.success) {
        return {
          success: false,
          error: { code: "NODE_NOT_HEALTHY", message: result.error || "Node failed to restart" },
        };
      }

      const processDetails: ProcessDetails = {
        pid: proc.pid,
        apiUri: `http://127.0.0.1:${nodeConfig.httpPort}`,
        stakingAddress: `127.0.0.1:${nodeConfig.stakingPort}`,
      };
      saveProcessDetails(nodeDir, processDetails);

      onProgress?.(`node ${nodeId} restarted`);

      return {
        success: true,
        data: {
          nodeId: nodeConfig.nodeId,
          uri: `http://127.0.0.1:${nodeConfig.httpPort}`,
          stakingAddress: `127.0.0.1:${nodeConfig.stakingPort}`,
          isValidator: nodeConfig.isValidator,
          trackedSubnets: nodeConfig.trackedSubnets,
        },
      };
    },
    { operation: `restartNodeById:${networkName}:${nodeId}` }
  );
}

/**
 * Stop a node by its node ID.
 */
export async function stopNodeById(
  networkName: string | null,
  nodeId: string,
  onProgress?: (message: string) => void
): Promise<CommandOutput<{ nodeId: string; stopped: boolean }>> {
  logger.fileDebug(`[stopNodeById] START nodeId=${nodeId}`);

  if (!networkName) {
    return { success: false, error: { code: "TMPNET_NOT_RUNNING", message: "No active network" } };
  }

  return withNetworkLock(
    networkName,
    async () => {
      const networkPath = join(NETWORKS_DIR, networkName);
      const nodeDir = join(networkPath, nodeId);

      if (!existsSync(nodeDir)) {
        return { success: false, error: { code: "NOT_FOUND", message: `Node ${nodeId} not found` } };
      }

      const nodeConfig = loadNodeConfig(nodeDir);
      if (!nodeConfig) {
        return { success: false, error: { code: "NOT_FOUND", message: "Node config not found" } };
      }

      onProgress?.(`stopping node ${nodeId}...`);

      await killProcessesOnPorts([nodeConfig.httpPort]);
      await Bun.sleep(NODE_RESTART_WAIT);

      onProgress?.(`node ${nodeId} stopped`);

      return {
        success: true,
        data: { nodeId: nodeConfig.nodeId, stopped: true },
      };
    },
    { operation: `stopNodeById:${networkName}:${nodeId}` }
  );
}

/**
 * Restart an L1 node (located by subnet ID) and clear its database.
 */
export async function restartL1Node(
  networkName: string | null,
  subnetId: string,
  pluginDir: string,
  getStatus: (options?: { primaryNetworkOnly?: boolean }) => Promise<
    CommandOutput<{ running: boolean; nodes: NodeInfo[] }>
  >,
  ensureAvalanchego: (onProgress?: (message: string) => void) => Promise<string | null>,
  onProgress?: (message: string) => void
): Promise<CommandOutput<NodeInfo>> {
  logger.fileDebug(`[restartL1Node] START subnetId=${subnetId}`);

  if (!networkName) {
    return { success: false, error: { code: "TMPNET_NOT_RUNNING", message: "No active network" } };
  }

  return withNetworkLock(
    networkName,
    async () => {
      const networkPath = join(NETWORKS_DIR, networkName);
      const nodeDirs = getNodeDirectories(networkPath);

      let targetDir: string | null = null;
      let nodeConfig: NodeConfig | null = null;

      for (const dir of nodeDirs) {
        const config = loadNodeConfig(join(networkPath, dir));
        if (config?.trackedSubnets?.includes(subnetId)) {
          targetDir = join(networkPath, dir);
          nodeConfig = config;
          break;
        }
      }

      if (!targetDir || !nodeConfig) {
        return { success: false, error: { code: "NOT_FOUND", message: `No node found tracking subnet ${subnetId}` } };
      }

      onProgress?.(`restarting L1 node ${nodeConfig.nodeId}...`);

      await killProcessesOnPorts([nodeConfig.httpPort]);

      const dbDir = join(targetDir, "db");
      rmSync(dbDir, { recursive: true, force: true });
      mkdirSync(dbDir, { recursive: true });

      const avalanchego = await ensureAvalanchego(onProgress);
      if (!avalanchego) {
        return { success: false, error: { code: "DOWNLOAD_FAILED", message: "Failed to find avalanchego" } };
      }

      const status = await getStatus({ primaryNetworkOnly: true });
      const bootstrapNode = status.data?.nodes.find((n) => n.isValidator);

      const args = buildBaseNodeArgs(nodeConfig.httpPort, nodeConfig.stakingPort, targetDir, pluginDir);
      args.push(`--track-subnets=${subnetId}`);
      addBootstrapArgs(args, bootstrapNode?.nodeId);
      ensureExecutable(avalanchego);

      const proc = spawn([avalanchego, ...args], {
        cwd: targetDir,
        stdout: "ignore",
        stderr: "ignore",
        detached: true,
      });
      proc.unref();
      addNodeProcess(proc);

      const result = await waitForNode(nodeConfig.httpPort, 120, onProgress);
      if (!result.success) {
        return {
          success: false,
          error: { code: "NODE_NOT_HEALTHY", message: result.error || "Node failed to restart" },
        };
      }

      return {
        success: true,
        data: {
          nodeId: nodeConfig.nodeId,
          uri: `http://127.0.0.1:${nodeConfig.httpPort}`,
          stakingAddress: `127.0.0.1:${nodeConfig.stakingPort}`,
          isValidator: false,
          trackedSubnets: nodeConfig.trackedSubnets,
        },
      };
    },
    { operation: `restartL1Node:${networkName}:${subnetId}` }
  );
}
