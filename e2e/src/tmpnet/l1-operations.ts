/**
 * L1 Node Operations
 *
 * Operations for managing L1 validator nodes within a tmpnet.  Ported from
 * avalanche-ai with DI / ConfigService dependencies stripped.
 */

import { join } from "path";

import type { CommandOutput } from "../utils/types.ts";
import { NETWORKS_DIR } from "./constants.ts";
import { withNetworkLock } from "./lock.ts";
import { getNodeDirectories, startL1Node } from "./node-operations.ts";
import { safeProgress } from "./process.ts";
import type { NodeInfo } from "./types.ts";

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

