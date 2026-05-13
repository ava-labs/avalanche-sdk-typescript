/**
 * Tmpnet Node Operations
 *
 * Spawn / configure / persist individual nodes.  Ported from avalanche-ai
 * with two changes:
 *   - imports rebased onto local utils
 *   - getNodeIdWithBLSFromUri inlined as a raw POST so we don't need to pull
 *     in `@avalanche-sdk/client` here
 */

import { existsSync, readFileSync, readdirSync, renameSync, rmSync } from "fs";
import { join } from "path";
import { type Subprocess, spawn } from "bun";

import { ensureExecutable, mkdirSecure, writeFileSecure } from "../utils/fs-secure.ts";
import { logger } from "../utils/logger.ts";
import { NodeConfigSchema, safeJsonParse } from "../utils/validation.ts";
import { MAX_PRECONFIGURED_STAKERS, PLUGIN_DIR, STAKING_KEYS_DIR } from "./constants.ts";
import { addNodeProcess, getStakerNumFromPort, gracefulKill, safeProgress, waitForNode } from "./process.ts";
import type { NodeConfig, NodeInfo, NodeStartResult, ProcessDetails } from "./types.ts";

// ----------------------------------------------------------------------------
// BLS key helper (inlined replacement for avalanche-ai's getNodeIdWithBLSFromUri)
// ----------------------------------------------------------------------------
interface NodeIdWithBLS {
  nodeId: string;
  blsPublicKey?: string;
  blsProofOfPossession?: string;
}

async function getNodeIdWithBLSFromUri(uri: string): Promise<NodeIdWithBLS> {
  const response = await fetch(`${uri}/ext/info`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "info.getNodeID" }),
  });
  const data = (await response.json()) as {
    result?: {
      nodeID?: string;
      nodePOP?: { publicKey?: string; proofOfPossession?: string };
    };
  };
  return {
    nodeId: data.result?.nodeID ?? "unknown",
    blsPublicKey: data.result?.nodePOP?.publicKey,
    blsProofOfPossession: data.result?.nodePOP?.proofOfPossession,
  };
}

// ----------------------------------------------------------------------------
// Directory utilities
// ----------------------------------------------------------------------------

/** Remove leftover `node-temp-*` directories from failed startups. */
export function cleanupTempDirectories(networkPath: string): void {
  if (!existsSync(networkPath)) return;

  try {
    const entries = readdirSync(networkPath);
    for (const entry of entries) {
      if (entry.startsWith("node-temp-")) {
        const tempPath = join(networkPath, entry);
        try {
          rmSync(tempPath, { recursive: true, force: true });
          logger.file(`Cleaned up stale temp directory: ${entry}`);
        } catch (e) {
          const message = e instanceof Error ? e.message : String(e);
          logger.warn(`Failed to cleanup temp directory ${entry} at ${tempPath}: ${message}`);
        }
      }
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logger.warn(`Failed to read directories for cleanup from ${networkPath}: ${message}`);
  }
}

/**
 * Get all node directories in a network path, sorted by HTTP port (so the
 * bootstrap node is first).
 */
export function getNodeDirectories(networkPath: string): string[] {
  if (!existsSync(networkPath)) return [];

  try {
    return readdirSync(networkPath)
      .filter((entry) => {
        if (!entry.startsWith("NodeID-")) return false;
        const configPath = join(networkPath, entry, "config.json");
        return existsSync(configPath);
      })
      .sort((a, b) => {
        const configA = loadNodeConfig(join(networkPath, a));
        const configB = loadNodeConfig(join(networkPath, b));
        const portA = configA?.httpPort || 99999;
        const portB = configB?.httpPort || 99999;
        return portA - portB;
      });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logger.warn(`Failed to read node directories from ${networkPath}: ${message}`);
    return [];
  }
}

export function countNodes(networkPath: string): number {
  return getNodeDirectories(networkPath).length;
}

// ----------------------------------------------------------------------------
// avalanchego argument builders
// ----------------------------------------------------------------------------

export function buildBaseNodeArgs(
  httpPort: number,
  stakingPort: number,
  nodeDir: string,
  pluginDir: string = PLUGIN_DIR
): string[] {
  return [
    `--http-port=${httpPort}`,
    `--staking-port=${stakingPort}`,
    `--db-dir=${join(nodeDir, "db")}`,
    `--log-dir=${join(nodeDir, "logs")}`,
    `--chain-data-dir=${join(nodeDir, "chainData")}`,
    `--data-dir=${nodeDir}`,
    "--network-id=local",
    "--http-host=127.0.0.1",
    // sybil-protection MUST stay ON so the local network treats nodes as
    // real P-Chain validators with their staker NodeIDs. With it off,
    // avalanchego reports myNodeID=NodeID-111...111 (empty) and the
    // signature-aggregator's getCurrentValidators(PrimaryNetwork) returns
    // an empty list — leading to "failed to connect to any bootstrap nodes".
    // Real staker keys come from STAKING_KEYS_DIR.
    `--plugin-dir=${pluginDir}`,
    // Debug logging so warp predicate verification failures surface in
    // the L1 chain log instead of dying silently.
    "--log-level=debug",
    "--log-display-level=debug",
    // Per-VM chain config dir — we write a chainConfig that enables
    // subnet-evm's debug logging so VerifyPredicate / warp errors show
    // up in the subnet-evm chain log (not just avalanchego's main log).
    `--chain-config-dir=${join(nodeDir, "chainConfigs")}`,
  ];
}

export function addStakingKeyArgs(args: string[], stakerNum: number): void {
  if (stakerNum >= 1 && stakerNum <= MAX_PRECONFIGURED_STAKERS) {
    const crt = join(STAKING_KEYS_DIR, `staker${stakerNum}.crt`);
    const key = join(STAKING_KEYS_DIR, `staker${stakerNum}.key`);
    const signer = join(STAKING_KEYS_DIR, `signer${stakerNum}.key`);
    // Only wire the preconfigured staker files if they actually exist.
    // On CI there are no preshipped keys — let avalanchego auto-generate
    // them under --data-dir instead of failing to load missing certs.
    if (!existsSync(crt) || !existsSync(key) || !existsSync(signer)) return;
    args.push(
      `--staking-tls-cert-file=${crt}`,
      `--staking-tls-key-file=${key}`,
      `--staking-signer-key-file=${signer}`
    );
  } else {
    args.push("--staking-ephemeral-cert-enabled=true", "--staking-ephemeral-signer-enabled=true");
  }
}

export function addBootstrapArgs(args: string[], bootstrapNodeId?: string): void {
  if (bootstrapNodeId) {
    args.push("--bootstrap-ips=127.0.0.1:9651", `--bootstrap-ids=${bootstrapNodeId}`);
  } else {
    args.push("--bootstrap-ips=", "--bootstrap-ids=");
  }
}

// ----------------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------------

export function createNodeDirectoryStructure(nodeDir: string): void {
  mkdirSecure(nodeDir, { recursive: true });
  mkdirSecure(join(nodeDir, "db"), { recursive: true });
  mkdirSecure(join(nodeDir, "logs"), { recursive: true });
  mkdirSecure(join(nodeDir, "chainData"), { recursive: true });
  // Per-VM config so subnet-evm logs at debug level. The subnet-evm
  // plugin doesn't inherit avalanchego's --log-level — we have to set
  // it via chainConfigs/<vmID>/config.json.
  const subnetEvmVmID = "srEXiWaHuhNyGwPUi444Tu47ZEDwxTWrbQiuD7FmgSAQ6X7Dy";
  const cfgDir = join(nodeDir, "chainConfigs", subnetEvmVmID);
  mkdirSecure(cfgDir, { recursive: true });
  writeFileSecure(
    join(cfgDir, "config.json"),
    JSON.stringify({ "log-level": "debug" }),
  );
}

export function saveNodeConfig(nodeDir: string, config: NodeConfig): void {
  writeFileSecure(join(nodeDir, "config.json"), JSON.stringify(config, null, 2));
}

export function loadNodeConfig(nodeDir: string): NodeConfig | null {
  const configPath = join(nodeDir, "config.json");
  if (!existsSync(configPath)) return null;

  try {
    const content = readFileSync(configPath, "utf-8");
    const parsed = safeJsonParse(content, NodeConfigSchema, configPath);
    if (!parsed || !parsed.nodeId || parsed.httpPort === undefined) return null;
    return {
      nodeId: parsed.nodeId,
      httpPort: parsed.httpPort,
      stakingPort: parsed.stakingPort ?? parsed.httpPort + 1,
      isValidator: parsed.isValidator ?? false,
      trackedSubnets: parsed.trackedSubnets,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logger.warn(`Failed to load or parse node config from ${configPath}: ${message}`);
    return null;
  }
}

export function saveProcessDetails(nodeDir: string, details: ProcessDetails): void {
  writeFileSecure(join(nodeDir, "process.json"), JSON.stringify(details, null, 2));
}

// ----------------------------------------------------------------------------
// Spawning
// ----------------------------------------------------------------------------

/** Spawn an avalanchego process detached so it survives CLI exit. */
export function spawnNode(avalanchego: string, args: string[], cwd: string): Subprocess {
  ensureExecutable(avalanchego);
  const proc = spawn([avalanchego, ...args], {
    cwd,
    stdout: "ignore",
    stderr: "ignore",
    detached: true,
  });
  proc.unref();
  addNodeProcess(proc);
  return proc;
}

/** Start a brand-new validator node and return startup data. */
export async function startNewNode(
  avalanchego: string,
  networkPath: string,
  nodeIndex: number,
  pluginDir: string,
  bootstrapNodeId?: string
): Promise<NodeStartResult> {
  ensureExecutable(avalanchego);

  const httpPort = 9650 + nodeIndex * 100;
  const stakingPort = httpPort + 1;
  const stakerNum = nodeIndex + 1;

  const tempNodeDir = join(networkPath, `node-temp-${nodeIndex}`);
  createNodeDirectoryStructure(tempNodeDir);

  const args = buildBaseNodeArgs(httpPort, stakingPort, tempNodeDir, pluginDir);
  addStakingKeyArgs(args, stakerNum);
  addBootstrapArgs(args, bootstrapNodeId);

  // Capture stdout/stderr to disk so we can diagnose silent startup failures.
  // avalanchego writes its own logs under --log-dir, but anything it emits
  // before opening that sink (cert load errors, port conflicts, etc.) only
  // appears on stdio.
  const stdioPath = join(tempNodeDir, "stdio.log");
  const proc = spawn([avalanchego, ...args], {
    cwd: tempNodeDir,
    stdout: Bun.file(stdioPath),
    stderr: Bun.file(stdioPath),
    detached: true,
  });
  proc.unref();

  return { proc, tempDir: tempNodeDir, httpPort, stakingPort, stakerNum };
}

/** Finalize a started node: rename temp dir, save config + process.json. */
export async function finalizeNode(
  proc: Subprocess,
  tempDir: string,
  networkPath: string,
  httpPort: number,
  stakingPort: number,
  stakerNum: number,
  nodeId: string
): Promise<NodeInfo> {
  const finalNodeDir = join(networkPath, nodeId);
  try {
    renameSync(tempDir, finalNodeDir);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logger.warn(`Failed to rename temp dir ${tempDir} to ${nodeId}: ${message}`);
  }

  const nodeConfig: NodeConfig = {
    nodeId,
    httpPort,
    stakingPort,
    isValidator: stakerNum <= MAX_PRECONFIGURED_STAKERS,
  };
  saveNodeConfig(finalNodeDir, nodeConfig);

  const processDetails: ProcessDetails = {
    pid: proc.pid,
    apiUri: `http://127.0.0.1:${httpPort}`,
    stakingAddress: `127.0.0.1:${stakingPort}`,
  };
  saveProcessDetails(finalNodeDir, processDetails);

  return {
    nodeId,
    uri: `http://127.0.0.1:${httpPort}`,
    stakingAddress: `127.0.0.1:${stakingPort}`,
    isValidator: stakerNum <= MAX_PRECONFIGURED_STAKERS,
  };
}

/** Re-launch an existing node from its persisted config. */
export function startExistingNode(
  avalanchego: string,
  networkPath: string,
  nodeDir: string,
  config: NodeConfig,
  pluginDir: string,
  bootstrapNodeId?: string
): Subprocess | null {
  ensureExecutable(avalanchego);

  const nodePath = join(networkPath, nodeDir);
  const args = buildBaseNodeArgs(config.httpPort, config.stakingPort, nodePath, pluginDir);

  if (config.isValidator) {
    const stakerNum = getStakerNumFromPort(config.httpPort);
    addStakingKeyArgs(args, stakerNum);
  }

  if (config.trackedSubnets && config.trackedSubnets.length > 0) {
    args.push(`--track-subnets=${config.trackedSubnets.join(",")}`);
  }

  addBootstrapArgs(args, bootstrapNodeId);

  try {
    const proc = spawn([avalanchego, ...args], {
      cwd: nodePath,
      stdout: "ignore",
      stderr: "ignore",
      detached: true,
    });
    proc.unref();

    const processDetails: ProcessDetails = {
      pid: proc.pid,
      apiUri: `http://127.0.0.1:${config.httpPort}`,
      stakingAddress: `127.0.0.1:${config.stakingPort}`,
    };
    saveProcessDetails(nodePath, processDetails);

    return proc;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logger.warn(`Failed to start existing node at ${nodePath} on port ${config.httpPort}: ${message}`);
    return null;
  }
}

/** Start an L1 validator node with `--track-subnets`. */
export async function startL1Node(
  avalanchego: string,
  networkPath: string,
  nodeNum: number,
  subnetId: string,
  bootstrapNode: NodeInfo,
  pluginDir: string,
  onProgress?: (message: string) => void
): Promise<{ success: boolean; nodeInfo?: NodeInfo; error?: string }> {
  const httpPort = 9650 + nodeNum * 100;
  const stakingPort = httpPort + 1;

  safeProgress(onProgress, "creating L1 validator node...");

  const tempNodeDir = join(networkPath, `node-temp-${nodeNum}`);
  createNodeDirectoryStructure(tempNodeDir);
  mkdirSecure(join(tempNodeDir, "staking"), { recursive: true });

  const args = buildBaseNodeArgs(httpPort, stakingPort, tempNodeDir, pluginDir);
  args.push(`--track-subnets=${subnetId}`);
  addBootstrapArgs(args, bootstrapNode.nodeId);

  ensureExecutable(avalanchego);
  safeProgress(onProgress, `starting node on port ${httpPort}...`);

  const proc = spawn([avalanchego, ...args], {
    cwd: tempNodeDir,
    stdout: "ignore",
    stderr: "ignore",
    detached: true,
  });
  proc.unref();
  addNodeProcess(proc);

  const result = await waitForNode(httpPort, 30, onProgress);
  if (!result.success || !result.nodeId) {
    try {
      if (proc.pid) await gracefulKill(proc.pid, 5000);
      else proc.kill();
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      logger.warn(`Failed to kill L1 node process on port ${httpPort}: ${message}`);
    }
    rmSync(tempNodeDir, { recursive: true, force: true });
    return { success: false, error: result.error || "Node failed to start" };
  }

  const finalNodeDir = join(networkPath, result.nodeId);
  try {
    renameSync(tempNodeDir, finalNodeDir);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logger.warn(`Failed to rename L1 node temp dir ${tempNodeDir} to ${result.nodeId}: ${message}`);
  }

  const nodeConfig: NodeConfig = {
    nodeId: result.nodeId,
    httpPort,
    stakingPort,
    isValidator: false,
    trackedSubnets: [subnetId],
  };
  saveNodeConfig(finalNodeDir, nodeConfig);

  const processDetails: ProcessDetails = {
    pid: proc.pid,
    apiUri: `http://127.0.0.1:${httpPort}`,
    stakingAddress: `127.0.0.1:${stakingPort}`,
  };
  saveProcessDetails(finalNodeDir, processDetails);

  // Fetch BLS keys from the running node (best-effort)
  const nodeUri = `http://127.0.0.1:${httpPort}`;
  let blsPublicKey: string | undefined;
  let blsProofOfPossession: string | undefined;
  try {
    const blsInfo = await getNodeIdWithBLSFromUri(nodeUri);
    blsPublicKey = blsInfo.blsPublicKey;
    blsProofOfPossession = blsInfo.blsProofOfPossession;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logger.warn(`Failed to fetch BLS keys from L1 node at ${nodeUri}: ${message}`);
  }

  safeProgress(onProgress, `node ready: ${result.nodeId}`);

  return {
    success: true,
    nodeInfo: {
      nodeId: result.nodeId,
      uri: nodeUri,
      stakingAddress: `127.0.0.1:${stakingPort}`,
      isValidator: false,
      trackedSubnets: [subnetId],
      blsPublicKey,
      blsProofOfPossession,
    },
  };
}
