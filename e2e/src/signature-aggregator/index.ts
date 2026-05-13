/**
 * Signature Aggregator Manager
 *
 * Wraps the `icm-services` signature-aggregator binary so e2e tests can
 * aggregate Warp message signatures against a local tmpnet.  Ported from
 * avalanche-ai with DI stripped and binary-download logic inlined (no
 * checksum verification -- the e2e harness can re-add that if needed).
 */

import { chmodSync, existsSync, readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import type { Subprocess } from "bun";

import { mkdirSecure, writeFileSecure } from "../utils/fs-secure.ts";
import { logger } from "../utils/logger.ts";
import { SPAWN_TIMEOUTS, spawnWithTimeout, withRetry } from "../utils/retry.ts";
import type { IDisposable } from "../utils/types.ts";
import type {
  AggregateSignaturesRequest,
  AggregateSignaturesResponse,
  PeerConfig,
  SignatureAggregatorConfig,
  SignatureAggregatorHealth,
  SignatureAggregatorStatus,
} from "./types.ts";

export * from "./types.ts";

const BIN_DIR = join(homedir(), ".avalanche-cli", "bin");
const ICM_SERVICES_RELEASES_API = "https://api.github.com/repos/ava-labs/icm-services/releases";
const SIGNATURE_AGGREGATOR_PREFIX = "signature-aggregator-";

/** Recommended signature-aggregator version. */
export const DEFAULT_SIGNATURE_AGGREGATOR_VERSION = "v0.5.3";

interface GithubRelease {
  tag_name: string;
  assets: Array<{ name: string; browser_download_url: string }>;
}

function getSignatureAggregatorAssetName(version: string): string {
  const platform = process.platform;
  const arch = process.arch;
  const versionNum = version.replace("v", "");

  if (platform === "darwin") {
    const archSuffix = arch === "arm64" ? "arm64" : "amd64";
    return `signature-aggregator_${versionNum}_darwin_${archSuffix}.tar.gz`;
  }

  if (platform === "linux") {
    const archSuffix = arch === "arm64" ? "arm64" : "amd64";
    return `signature-aggregator_${versionNum}_linux_${archSuffix}.tar.gz`;
  }

  throw new Error(`Unsupported platform: ${platform}/${arch}`);
}

/**
 * Download and install the signature-aggregator binary if not already present.
 * Returns the absolute path to the installed binary.
 */
async function downloadSignatureAggregator(
  version: string,
  onProgress?: (msg: string) => void
): Promise<string> {
  const tagName = version.startsWith("v")
    ? `${SIGNATURE_AGGREGATOR_PREFIX}${version}`
    : `${SIGNATURE_AGGREGATOR_PREFIX}v${version}`;
  const normalizedVersion = version.startsWith("v") ? version : `v${version}`;

  onProgress?.(`fetching release info for signature-aggregator ${normalizedVersion}...`);

  const release = await withRetry(async () => {
    const response = await fetch(`${ICM_SERVICES_RELEASES_API}/tags/${tagName}`, {
      signal: AbortSignal.timeout(SPAWN_TIMEOUTS.DOWNLOAD),
    });
    if (!response.ok) throw new Error(`Release ${tagName} not found`);
    return (await response.json()) as GithubRelease;
  });

  const assetName = getSignatureAggregatorAssetName(normalizedVersion);
  const asset = release.assets.find((a) => a.name === assetName);
  if (!asset) {
    throw new Error(`No signature-aggregator binary found for ${process.platform}/${process.arch} (${assetName})`);
  }

  const installDir = join(BIN_DIR, "signature-aggregator", `signature-aggregator-${normalizedVersion}`);
  const binaryPath = join(installDir, "signature-aggregator");

  if (existsSync(binaryPath)) {
    chmodSync(binaryPath, 0o755);
    onProgress?.(`signature-aggregator ${normalizedVersion} already installed`);
    return binaryPath;
  }

  mkdirSecure(installDir, { recursive: true });

  onProgress?.(`downloading signature-aggregator ${normalizedVersion}...`);
  const archiveBuffer = await withRetry(async () => {
    const downloadResponse = await fetch(asset.browser_download_url, {
      signal: AbortSignal.timeout(SPAWN_TIMEOUTS.DOWNLOAD),
    });
    if (!downloadResponse.ok) throw new Error(`Download failed: ${downloadResponse.statusText}`);
    return await downloadResponse.arrayBuffer();
  });

  const archivePath = join(installDir, assetName);
  await Bun.write(archivePath, archiveBuffer);

  onProgress?.("extracting...");
  const sigAggExtract = await spawnWithTimeout(["tar", "-xzf", archivePath, "-C", installDir], {
    cwd: installDir,
    timeoutMs: SPAWN_TIMEOUTS.EXTRACT,
  });
  if (sigAggExtract.timedOut) throw new Error("Extraction timed out");

  if (existsSync(binaryPath)) {
    chmodSync(binaryPath, 0o755);
  } else {
    throw new Error("Failed to extract signature-aggregator binary");
  }

  try {
    await spawnWithTimeout(["rm", "-f", archivePath], { timeoutMs: SPAWN_TIMEOUTS.SHORT });
  } catch (e) {
    logger.ignored("cleaning up signature-aggregator archive", e);
  }

  onProgress?.(`installed signature-aggregator ${normalizedVersion}`);
  return binaryPath;
}

// ----------------------------------------------------------------------------
// Process helpers (PID-based gracefulKill, mirroring tmpnet/process.ts but
// kept local so this file has no dependency on the tmpnet driver)
// ----------------------------------------------------------------------------

function isProcessRunning(pid: number): boolean {
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

async function gracefulKill(pid: number, timeoutMs = 5000): Promise<boolean> {
  if (!isProcessRunning(pid)) return true;
  try {
    logger.file(`[signature-aggregator] Sending SIGTERM to PID ${pid}`);
    process.kill(pid, "SIGTERM");

    const exitedGracefully = await waitForProcessExit(pid, timeoutMs);
    if (exitedGracefully) return true;

    if (isProcessRunning(pid)) {
      logger.file(`[signature-aggregator] PID ${pid} didn't exit gracefully, sending SIGKILL`);
      process.kill(pid, 9);
      await Bun.sleep(100);
    }
    return !isProcessRunning(pid);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ESRCH") return true;
    logger.file(`[signature-aggregator] Error killing PID ${pid}: ${error}`);
    return false;
  }
}

// ----------------------------------------------------------------------------
// SignatureAggregatorManager
// ----------------------------------------------------------------------------

export interface SignatureAggregatorManagerOptions {
  /** Override the binary version to download (default: v0.5.3) */
  version?: string;
}

export class SignatureAggregatorManager implements IDisposable {
  private process: Subprocess | null = null;
  private configPath: string | null = null;
  private apiPort = 8080;
  private metricsPort = 8081;
  private readonly version: string;

  constructor(options: SignatureAggregatorManagerOptions = {}) {
    this.version = options.version ?? DEFAULT_SIGNATURE_AGGREGATOR_VERSION;
  }

  /**
   * Start the signature aggregator for a tmpnet network.
   */
  async start(
    networkDir: string,
    options: {
      logLevel?: "debug" | "info" | "warn" | "error";
      apiPort?: number;
      metricsPort?: number;
      trackedSubnets?: string[];
    } = {},
    onProgress?: (msg: string) => void
  ): Promise<SignatureAggregatorStatus> {
    await this.stop();

    onProgress?.("ensuring signature-aggregator binary...");
    const binaryPath = await this.ensureBinary(onProgress);
    if (!binaryPath) {
      return { running: false, healthy: false, error: "Failed to find or download signature-aggregator binary" };
    }

    onProgress?.("discovering validators...");
    const peers = await this.discoverValidators(networkDir);

    if (peers.length === 0) {
      return { running: false, healthy: false, error: "No validators found in network" };
    }

    onProgress?.(`found ${peers.length} validators`);

    this.apiPort = options.apiPort ?? 8080;
    this.metricsPort = options.metricsPort ?? 8081;

    const config: SignatureAggregatorConfig = {
      "log-level": options.logLevel ?? "info",
      "p-chain-api": { "base-url": "http://127.0.0.1:9650" },
      "info-api": { "base-url": "http://127.0.0.1:9650" },
      "api-port": this.apiPort,
      "metrics-port": this.metricsPort,
      "allow-private-ips": true,
      "manually-tracked-peers": peers,
    };

    if (options.trackedSubnets?.length) {
      config["tracked-subnet-ids"] = options.trackedSubnets;
    }

    this.configPath = join(networkDir, "signature-aggregator-config.json");
    writeFileSecure(this.configPath, JSON.stringify(config, null, 2));
    onProgress?.("wrote config");

    const portInUse = await this.isPortInUse(this.apiPort);
    if (portInUse) {
      await this.killProcessOnPort(this.apiPort);
      await Bun.sleep(500);
    }

    onProgress?.("starting signature-aggregator...");

    // Capture stdout/stderr to a file so failures are diagnosable. Without
    // this any startup crash is invisible (the prior "pipe" config left the
    // streams hanging and dropped on the floor).
    const stdioPath = join(networkDir, "signature-aggregator-stdio.log");
    this.process = Bun.spawn([binaryPath, "--config-file", this.configPath], {
      stdout: Bun.file(stdioPath),
      stderr: Bun.file(stdioPath),
      env: { ...process.env },
      detached: true,
    });
    this.process.unref();

    const maxAttempts = 30;
    for (let i = 0; i < maxAttempts; i++) {
      await Bun.sleep(500);
      const status = await this.getStatus();
      if (status.running) {
        onProgress?.("signature-aggregator ready");
        return status;
      }
    }

    return { running: false, healthy: false, error: "Timeout waiting for signature-aggregator to start" };
  }

  async stop(): Promise<void> {
    if (this.process) {
      try {
        if (this.process.pid) await gracefulKill(this.process.pid, 5000);
        else this.process.kill();
      } catch (e) {
        logger.ignored("stopping signature aggregator process", e);
      }
      this.process = null;
    }
    await this.killProcessOnPort(this.apiPort);
  }

  async dispose(): Promise<void> {
    await this.stop();
  }

  async getStatus(): Promise<SignatureAggregatorStatus> {
    try {
      return await withRetry(async () => {
        const response = await fetch(`http://127.0.0.1:${this.apiPort}/health`, {
          signal: AbortSignal.timeout(2000),
        });
        const health = (await response.json()) as SignatureAggregatorHealth;
        const details = health.details?.["signature-aggregator-health"];

        return {
          running: true,
          healthy: health.status === "up",
          apiUrl: `http://127.0.0.1:${this.apiPort}`,
          metricsUrl: `http://127.0.0.1:${this.metricsPort}`,
          error: details?.error,
          pid: this.process?.pid,
        };
      });
    } catch (e) {
      logger.ignored("checking signature aggregator status", e);
      return { running: false, healthy: false };
    }
  }

  /**
   * Aggregate signatures for a Warp message.  For tmpnet we default to
   * quorum-percentage: 1 (any single validator is enough).
   */
  async aggregateSignatures(request: AggregateSignaturesRequest): Promise<AggregateSignaturesResponse> {
    const status = await this.getStatus();
    if (!status.running) {
      return { error: "Signature aggregator not running" };
    }

    const requestWithDefaults: AggregateSignaturesRequest = {
      "quorum-percentage": 1,
      ...request,
    };

    try {
      return await withRetry(async () => {
        const response = await fetch(`http://127.0.0.1:${this.apiPort}/aggregate-signatures`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestWithDefaults),
          signal: AbortSignal.timeout(60000),
        });
        const result = (await response.json()) as AggregateSignaturesResponse;
        if (!response.ok) return { error: result.error || `HTTP ${response.status}` };
        return result;
      });
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  }

  getApiUrl(): string {
    return `http://127.0.0.1:${this.apiPort}`;
  }

  getMetricsUrl(): string {
    return `http://127.0.0.1:${this.metricsPort}`;
  }

  // --------------------------------------------------------------------------
  // Private helpers
  // --------------------------------------------------------------------------

  private async ensureBinary(onProgress?: (msg: string) => void): Promise<string | null> {
    const normalizedVersion = this.version.startsWith("v") ? this.version : `v${this.version}`;
    const installDir = join(BIN_DIR, "signature-aggregator", `signature-aggregator-${normalizedVersion}`);
    const binaryPath = join(installDir, "signature-aggregator");

    if (existsSync(binaryPath)) {
      try {
        chmodSync(binaryPath, 0o755);
      } catch {
        // ignore
      }
      return binaryPath;
    }

    try {
      return await downloadSignatureAggregator(this.version, onProgress);
    } catch (err) {
      onProgress?.(`failed to download: ${err}`);
      return null;
    }
  }

  private async discoverValidators(networkDir: string): Promise<PeerConfig[]> {
    const peers: PeerConfig[] = [];

    const entries = await Bun.$`ls -d ${networkDir}/NodeID-* 2>/dev/null`.quiet().nothrow();
    const dirs = entries.text().trim().split("\n").filter(Boolean);

    for (const dir of dirs) {
      const configPath = join(dir, "config.json");
      if (!existsSync(configPath)) continue;

      try {
        const config = JSON.parse(readFileSync(configPath, "utf-8")) as {
          isValidator?: boolean;
          nodeId?: string;
          stakingPort?: number;
        };
        // Include ALL nodes, not just primary-network validators.
        // SubnetToL1Conversion messages have to be signed by validators of
        // the converted L1, and those L1 validator nodes are added with
        // isValidator: false (they're not primary-network validators).
        // The sig-aggregator filters by signing-subnet-id at request time —
        // we just have to make sure the peers are reachable.
        if (config.nodeId && config.stakingPort) {
          peers.push({ id: config.nodeId, ip: `127.0.0.1:${config.stakingPort}` });
        }
      } catch (e) {
        logger.ignored(`parsing validator config at ${dir}`, e);
      }
    }

    return peers;
  }

  private async isPortInUse(port: number): Promise<boolean> {
    try {
      const result = await Bun.$`lsof -i :${port} 2>/dev/null`.quiet().nothrow();
      return result.text().trim().length > 0;
    } catch (e) {
      logger.ignored(`checking if port ${port} is in use`, e);
      return false;
    }
  }

  private async killProcessOnPort(port: number): Promise<void> {
    try {
      const result = await Bun.$`lsof -ti :${port} 2>/dev/null`.quiet().nothrow();
      const pids = result.text().trim().split("\n").filter(Boolean);

      for (const pid of pids) {
        const pidNum = Number.parseInt(pid.trim(), 10);
        if (!Number.isNaN(pidNum) && pidNum > 0 && pidNum !== process.pid) {
          try {
            await gracefulKill(pidNum, 3000);
          } catch (e) {
            logger.ignored(`killing PID ${pidNum} on port ${port}`, e);
          }
        }
      }
    } catch (e) {
      logger.ignored(`killing processes on port ${port}`, e);
    }
  }
}
