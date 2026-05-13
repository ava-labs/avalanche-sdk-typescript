/**
 * Tmpnet Process Management
 *
 * Process lifecycle, port management, and node health checks.  Ported from
 * avalanche-ai.
 */

import type { Subprocess } from "bun";
import { logger } from "../utils/logger.ts";
import { pollWithBackoff } from "../utils/retry.ts";
import { NODE_HEALTH_TIMEOUT, NODE_QUICK_HEALTH_TIMEOUT, PROCESS_KILL_WAIT, TMPNET_PORTS } from "./constants.ts";
import type { NodeWaitResult } from "./types.ts";

// =============================================================================
// Input Validation
// =============================================================================

export function isValidPort(port: number): boolean {
  return Number.isInteger(port) && port >= 1 && port <= 65535;
}

export function isValidPid(pid: number): boolean {
  return Number.isInteger(pid) && pid > 0 && pid < 4194304;
}

// =============================================================================
// Process tracking
// =============================================================================

/** Hold subprocess handles so they don't get GC'd. */
let nodeProcesses: Subprocess[] = [];

export function cleanDeadProcesses(): number {
  const before = nodeProcesses.length;
  nodeProcesses = nodeProcesses.filter((proc) => {
    if (!proc.pid) return false;
    if (!isProcessRunning(proc.pid)) {
      logger.file(`[process] Removing dead process PID ${proc.pid} from tracking`);
      return false;
    }
    return true;
  });
  const removed = before - nodeProcesses.length;
  if (removed > 0) {
    logger.file(`[process] Cleaned ${removed} dead processes from tracking array`);
  }
  return removed;
}

export function getNodeProcesses(): Subprocess[] {
  return nodeProcesses;
}

export function setNodeProcesses(procs: Subprocess[]): void {
  cleanDeadProcesses();
  nodeProcesses = procs;
}

export function addNodeProcess(proc: Subprocess): void {
  if (nodeProcesses.length > 10) cleanDeadProcesses();
  nodeProcesses.push(proc);
}

export function clearNodeProcesses(): void {
  nodeProcesses = [];
}

/** Safe progress callback helper - swallows callback errors. */
export function safeProgress(onProgress: ((msg: string) => void) | undefined, msg: string): void {
  if (!onProgress) return;
  try {
    onProgress(msg);
  } catch (e) {
    logger.ignored("progress callback", e);
  }
}

export async function killTrackedProcesses(): Promise<void> {
  for (const proc of nodeProcesses) {
    try {
      if (proc.pid) {
        await gracefulKill(proc.pid, 5000);
      } else {
        proc.kill();
      }
    } catch (e) {
      logger.ignored(`killing process ${proc.pid}`, e);
    }
  }
  clearNodeProcesses();
}

export function fastKillAllProcesses(): void {
  for (const proc of nodeProcesses) {
    try {
      if (proc.pid && isProcessRunning(proc.pid)) {
        process.kill(proc.pid, 9);
      }
    } catch {
      // Ignore - process may already be dead
    }
  }
  clearNodeProcesses();
}

export async function gracefulKillAllProcesses(timeoutMs = 5000): Promise<boolean> {
  const pids = nodeProcesses.filter((p) => p.pid && isProcessRunning(p.pid)).map((p) => p.pid as number);
  if (pids.length === 0) {
    clearNodeProcesses();
    return true;
  }

  logger.file(`[process] Sending SIGTERM to ${pids.length} processes for graceful shutdown`);
  for (const pid of pids) {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      // ignore
    }
  }

  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    const stillRunning = pids.filter((pid) => isProcessRunning(pid));
    if (stillRunning.length === 0) {
      logger.file("[process] All processes exited gracefully");
      clearNodeProcesses();
      return true;
    }
    await Bun.sleep(100);
  }

  const stillRunning = pids.filter((pid) => isProcessRunning(pid));
  if (stillRunning.length > 0) {
    logger.file(`[process] ${stillRunning.length} processes did not exit gracefully after ${timeoutMs}ms`);
    return false;
  }
  clearNodeProcesses();
  return true;
}

export function sendSigtermToAllProcesses(): number {
  let count = 0;
  for (const proc of nodeProcesses) {
    try {
      if (proc.pid && isProcessRunning(proc.pid)) {
        process.kill(proc.pid, "SIGTERM");
        count++;
      }
    } catch {
      // ignore
    }
  }
  logger.file(`[process] Sent SIGTERM to ${count} processes`);
  return count;
}

// =============================================================================
// Port-based process killing
// =============================================================================

/**
 * Kill avalanchego processes on the given ports.  Verifies process name before
 * killing so we don't whack unrelated services.
 */
export async function killProcessesOnPorts(ports: number[] = TMPNET_PORTS): Promise<void> {
  const myPid = process.pid;
  const parentPid = process.ppid;

  for (const port of ports) {
    if (!isValidPort(port)) {
      logger.fileError(`killProcessesOnPorts: skipping invalid port ${port}`);
      continue;
    }

    try {
      const result = await Bun.$`lsof -ti :${port} 2>/dev/null`.quiet().nothrow();
      const pids = result.text().trim();
      if (pids) {
        for (const pid of pids.split("\n").filter(Boolean)) {
          try {
            const pidNum = Number.parseInt(pid.trim(), 10);
            if (!isValidPid(pidNum)) continue;
            if (pidNum === myPid || pidNum === parentPid) continue;

            const psResult = await Bun.$`ps -p ${pidNum} -o comm= 2>/dev/null`.quiet().nothrow();
            const processName = psResult.text().trim();

            if (processName.includes("avalanchego")) {
              logger.file(`killProcessesOnPorts: gracefully killing avalanchego PID ${pidNum} on port ${port}`);
              await gracefulKill(pidNum, 5000);
            } else if (processName === "") {
              logger.file(`killProcessesOnPorts: PID ${pidNum} already exited`);
            } else {
              logger.file(
                `killProcessesOnPorts: skipping non-avalanchego process PID ${pidNum} (${processName}) on port ${port}`
              );
            }
          } catch (e) {
            logger.ignored(`killing PID ${pid} on port ${port}`, e);
          }
        }
      }
    } catch (e) {
      logger.ignored(`checking port ${port}`, e);
    }
  }
  await Bun.sleep(PROCESS_KILL_WAIT);
}

/**
 * Kill avalanchego process on a specific port (more careful version).
 */
export async function killAvalanchegoOnPort(
  httpPort: number,
  loggerArg?: { file: (msg: string) => void; fileError: (msg: string) => void }
): Promise<void> {
  if (!isValidPort(httpPort)) {
    loggerArg?.fileError(`killAvalanchegoOnPort: invalid port ${httpPort}`);
    return;
  }

  try {
    const pgrepResult = await Bun.$`pgrep -f "avalanchego.*--http-port=${httpPort}" 2>/dev/null`.quiet().nothrow();
    let pids = pgrepResult.text().trim();
    loggerArg?.file(`Found avalanchego PIDs via pgrep: ${pids || "none"}`);

    if (!pids) {
      const lsofResult = await Bun.$`lsof -ti :${httpPort} 2>/dev/null`.quiet().nothrow();
      pids = lsofResult.text().trim();
      loggerArg?.file(`Found PIDs via lsof fallback: ${pids || "none"}`);
    }

    if (pids) {
      const pidList = pids.split("\n").filter(Boolean);
      const myPid = process.pid;
      const parentPid = process.ppid;

      for (const pid of pidList) {
        try {
          const pidNum = Number.parseInt(pid.trim(), 10);
          if (!isValidPid(pidNum)) continue;
          if (pidNum === myPid || pidNum === parentPid) continue;

          try {
            const psResult = await Bun.$`ps -p ${pidNum} -o comm= 2>/dev/null`.quiet().nothrow();
            const processName = psResult.text().trim();
            if (processName.includes("avalanchego") || processName === "") {
              const killed = await gracefulKill(pidNum, 5000);
              if (killed) loggerArg?.file(`Successfully killed PID ${pidNum}`);
            }
          } catch {
            const killed = await gracefulKill(pidNum, 5000);
            if (killed) loggerArg?.file(`Successfully killed PID ${pidNum}`);
          }
        } catch (innerKillErr) {
          loggerArg?.fileError(`Inner kill error for PID ${pid}: ${innerKillErr}`);
        }
      }
    }
  } catch (killErr) {
    loggerArg?.fileError(`Kill error: ${killErr}`);
  }
}

// =============================================================================
// Health checks
// =============================================================================

/** Wait for a node to respond on /ext/info with a NodeID. */
export async function waitForNode(
  httpPort: number,
  maxAttempts: number,
  onProgress?: (message: string) => void
): Promise<NodeWaitResult> {
  if (!isValidPort(httpPort)) {
    return { success: false, error: `Invalid port number: ${httpPort}` };
  }

  const startTime = Date.now();

  const result = await pollWithBackoff<{ success: boolean; nodeId?: string }>(
    {
      maxAttempts,
      initialDelayMs: 200,
      maxDelayMs: 2000,
      isSuccess: (r) => r.success && !!r.nodeId,
      onAttempt: (attempt) => {
        if (attempt > 0 && attempt % 10 === 0) {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
          safeProgress(onProgress, `syncing... (${elapsed}s)`);
        }
      },
    },
    async () => {
      try {
        const response = await fetch(`http://127.0.0.1:${httpPort}/ext/info`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "info.getNodeID" }),
          signal: AbortSignal.timeout(NODE_HEALTH_TIMEOUT),
        });
        const data = (await response.json()) as { result?: { nodeID: string } };
        if (data.result?.nodeID) {
          return { success: true, nodeId: data.result.nodeID };
        }
        return { success: false };
      } catch {
        return { success: false };
      }
    }
  );

  if (result.success && result.nodeId) {
    return { success: true, nodeId: result.nodeId };
  }
  return { success: false, error: "Timeout waiting for node to become healthy" };
}

/** Wait for a node's P-Chain to be bootstrapped. */
export async function waitForNodeBootstrapped(
  httpPort: number,
  maxAttempts = 300,
  onProgress?: (message: string) => void
): Promise<{ success: boolean; error?: string }> {
  if (!isValidPort(httpPort)) {
    return { success: false, error: `Invalid port number: ${httpPort}` };
  }

  const uri = `http://127.0.0.1:${httpPort}`;
  const startTime = Date.now();

  const result = await pollWithBackoff<{ success: boolean }>(
    {
      maxAttempts,
      initialDelayMs: 200,
      maxDelayMs: 2000,
      isSuccess: (r) => r.success,
      onAttempt: (attempt) => {
        if (attempt > 0 && attempt % 10 === 0) {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
          safeProgress(onProgress, `waiting for P-Chain to bootstrap... (${elapsed}s)`);
        }
      },
    },
    async () => {
      try {
        const response = await fetch(`${uri}/ext/health`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "health.health" }),
          signal: AbortSignal.timeout(NODE_HEALTH_TIMEOUT),
        });
        const data = (await response.json()) as {
          result?: { healthy: boolean; checks?: { P?: unknown } };
        };
        const pChainHealthy = data.result?.checks?.P !== undefined;
        return pChainHealthy ? { success: true } : { success: false };
      } catch {
        return { success: false };
      }
    }
  );

  return result.success ? { success: true } : { success: false, error: "Timeout waiting for P-Chain to bootstrap" };
}

/** Check whether a node is healthy and (optionally) only require primary chains. */
export async function checkNodeHealth(
  uri: string,
  quick = false,
  options?: { primaryNetworkOnly?: boolean }
): Promise<{ healthy: boolean; nodeId?: string; error?: string }> {
  const timeout = quick ? NODE_QUICK_HEALTH_TIMEOUT : NODE_HEALTH_TIMEOUT;

  try {
    const healthResponse = await fetch(`${uri}/ext/health`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "health.health" }),
      signal: AbortSignal.timeout(timeout),
    });
    const healthData = (await healthResponse.json()) as {
      result?: { healthy: boolean; checks?: Record<string, { error?: string; message?: unknown }> };
      error?: { message: string };
    };

    if (!healthData.result?.healthy) {
      if (options?.primaryNetworkOnly && healthData.result?.checks) {
        const checks = healthData.result.checks;
        // "not yet run" is avalanchego's placeholder before the periodic
        // health-check goroutine has fired its first iteration — it's not a
        // real failure. Treat it as not-yet-known rather than unhealthy,
        // otherwise we race the polling interval right after bootstrap.
        const isRealError = (c: { error?: string } | undefined): boolean =>
          !!c?.error && c.error !== "not yet run";
        // primaryNetworkOnly really means "P-Chain is enough" — X / C-Chain can
        // legitimately report unhealthy in a tmpnet (sybil-protection disabled,
        // missing validators, etc.) while P-Chain still serves issueTx /
        // getTxStatus / getValidatorsAt fine, which is all warp + L1 needs.
        const pChainHealthy = checks.P && !isRealError(checks.P);

        if (pChainHealthy) {
          try {
            const infoResponse = await fetch(`${uri}/ext/info`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "info.getNodeID" }),
              signal: AbortSignal.timeout(timeout),
            });
            const infoData = (await infoResponse.json()) as { result?: { nodeID: string } };
            return { healthy: true, nodeId: infoData.result?.nodeID };
          } catch {
            return { healthy: true };
          }
        }
      }

      return { healthy: false, error: healthData.error?.message || "node reports unhealthy" };
    }

    try {
      const infoResponse = await fetch(`${uri}/ext/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "info.getNodeID" }),
        signal: AbortSignal.timeout(timeout),
      });
      const infoData = (await infoResponse.json()) as { result?: { nodeID: string } };
      return { healthy: true, nodeId: infoData.result?.nodeID };
    } catch {
      return { healthy: true };
    }
  } catch (err) {
    const errorMsg =
      err instanceof Error ? (err.name === "TimeoutError" ? "timeout" : "not responding") : "connection failed";
    return { healthy: false, error: errorMsg };
  }
}

export async function checkChainBootstrapStatus(
  uri: string
): Promise<{ pChain: boolean; xChain: boolean; cChain: boolean; bootstrapped: boolean }> {
  try {
    const response = await fetch(`${uri}/ext/health`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "health.health" }),
      signal: AbortSignal.timeout(NODE_HEALTH_TIMEOUT),
    });

    const data = (await response.json()) as {
      result?: { healthy: boolean; checks?: { P?: unknown; X?: unknown; C?: unknown; bootstrapped?: unknown } };
    };

    if (!data.result) return { pChain: false, xChain: false, cChain: false, bootstrapped: false };

    return {
      pChain: data.result.checks?.P !== undefined,
      xChain: data.result.checks?.X !== undefined,
      cChain: data.result.checks?.C !== undefined,
      bootstrapped: data.result.checks?.bootstrapped !== undefined,
    };
  } catch {
    return { pChain: false, xChain: false, cChain: false, bootstrapped: false };
  }
}

export function getNodePorts(nodeIndex: number): { httpPort: number; stakingPort: number } {
  const httpPort = 9650 + nodeIndex * 100;
  return { httpPort, stakingPort: httpPort + 1 };
}

export function getStakerNumFromPort(httpPort: number): number {
  return Math.floor((httpPort - 9650) / 100) + 1;
}

export function isProcessRunning(pid: number): boolean {
  if (!isValidPid(pid)) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function waitForProcessExit(pid: number, timeoutMs: number): Promise<boolean> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    if (!isProcessRunning(pid)) return true;
    await Bun.sleep(100);
  }
  return false;
}

/** Gracefully kill a PID - SIGTERM first, then SIGKILL after timeout. */
export async function gracefulKill(pid: number, timeoutMs = 5000): Promise<boolean> {
  if (!isValidPid(pid)) {
    logger.fileError(`[process] gracefulKill: invalid PID ${pid}`);
    return false;
  }
  if (!isProcessRunning(pid)) return true;

  try {
    logger.file(`[process] Sending SIGTERM to PID ${pid}`);
    process.kill(pid, "SIGTERM");

    const exitedGracefully = await waitForProcessExit(pid, timeoutMs);
    if (exitedGracefully) {
      logger.file(`[process] PID ${pid} exited gracefully`);
      return true;
    }

    if (isProcessRunning(pid)) {
      logger.file(`[process] PID ${pid} didn't exit gracefully, sending SIGKILL`);
      process.kill(pid, 9);
      await Bun.sleep(100);
    }
    return !isProcessRunning(pid);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ESRCH") return true;
    logger.file(`[process] Error killing PID ${pid}: ${error}`);
    return false;
  }
}

export async function areNodesAlreadyRunning(
  nodeConfigs: Array<{ httpPort: number; pid?: number }>
): Promise<{ running: boolean; healthyCount: number }> {
  if (nodeConfigs.length === 0) return { running: false, healthyCount: 0 };

  const bootstrapConfig = nodeConfigs[0]!;
  const health = await checkNodeHealth(`http://127.0.0.1:${bootstrapConfig.httpPort}`, true);
  if (!health.healthy) return { running: false, healthyCount: 0 };

  const healthChecks = nodeConfigs.slice(1).map(async (config) => {
    const result = await checkNodeHealth(`http://127.0.0.1:${config.httpPort}`, true);
    return result.healthy;
  });

  const results = await Promise.all(healthChecks);
  return { running: true, healthyCount: 1 + results.filter(Boolean).length };
}
