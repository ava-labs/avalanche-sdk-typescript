/**
 * AvalancheGo binary download / cache helper.
 *
 * Ported from avalanche-ai with DI stripped: no ConfigService, just discover
 * an existing binary (cached path, system PATH) or download the latest
 * release into `~/.avalanche-cli/bin/<version>/avalanchego`.
 */

import { chmodSync, existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";

import { logger } from "./utils/logger.ts";
import { SPAWN_TIMEOUTS, spawnWithTimeout, withRetry } from "./utils/retry.ts";

const AVALANCHEGO_GITHUB_API = "https://api.github.com/repos/ava-labs/avalanchego/releases/latest";
const AVALANCHEGO_DIR = join(homedir(), ".avalanche-cli", "bin");

/** Cached path to the most recently resolved avalanchego binary. */
let cachedAvalanchegoPath: string | null = null;

export function getCachedAvalanchegoPath(): string | null {
  return cachedAvalanchegoPath;
}

export function setCachedAvalanchegoPath(path: string | null): void {
  cachedAvalanchegoPath = path;
}

interface GithubRelease {
  tag_name: string;
  assets: Array<{ name: string; browser_download_url: string }>;
}

function getPlatformAssetName(version: string): string {
  const platform = process.platform;
  const arch = process.arch;

  if (platform === "darwin") {
    return `avalanchego-macos-${version}.zip`;
  }
  if (platform === "linux") {
    const archSuffix = arch === "arm64" ? "arm64" : "amd64";
    return `avalanchego-linux-${archSuffix}-${version}.tar.gz`;
  }
  throw new Error(`Unsupported platform: ${platform}/${arch}`);
}

export async function getLatestVersion(): Promise<string> {
  return withRetry(async () => {
    const response = await fetch(AVALANCHEGO_GITHUB_API);
    if (!response.ok) throw new Error(`Failed to fetch release info: ${response.statusText}`);
    const data = (await response.json()) as GithubRelease;
    return data.tag_name;
  });
}

/**
 * Download (or reuse) the latest avalanchego release.  Returns the absolute
 * path to the binary.
 */
export async function downloadAvalanchego(onProgress?: (message: string) => void): Promise<string> {
  onProgress?.("checking latest version...");

  const release = await withRetry(async () => {
    const response = await fetch(AVALANCHEGO_GITHUB_API);
    if (!response.ok) throw new Error(`Failed to fetch release info: ${response.statusText}`);
    return (await response.json()) as GithubRelease;
  });
  const version = release.tag_name;
  const assetName = getPlatformAssetName(version);

  const asset = release.assets.find((a) => a.name === assetName);
  if (!asset) {
    throw new Error(`No binary found for ${process.platform}/${process.arch}`);
  }

  const installDir = join(AVALANCHEGO_DIR, version);
  const binaryPath = join(installDir, "avalanchego");

  if (existsSync(binaryPath)) {
    onProgress?.(`avalanchego ${version} already installed`);
    setCachedAvalanchegoPath(binaryPath);
    return binaryPath;
  }

  if (!existsSync(installDir)) {
    mkdirSync(installDir, { recursive: true });
  }

  onProgress?.(`downloading ${version}...`);

  const archiveBuffer = await withRetry(async () => {
    const downloadResponse = await fetch(asset.browser_download_url);
    if (!downloadResponse.ok) throw new Error(`Download failed: ${downloadResponse.statusText}`);
    return await downloadResponse.arrayBuffer();
  });
  const archivePath = join(installDir, assetName);
  await Bun.write(archivePath, archiveBuffer);

  onProgress?.("extracting...");

  if (assetName.endsWith(".zip")) {
    // macOS: build/avalanchego inside the zip
    const extractResult = await spawnWithTimeout(["unzip", "-o", archivePath, "-d", installDir], {
      cwd: installDir,
      timeoutMs: SPAWN_TIMEOUTS.EXTRACT,
    });
    if (extractResult.timedOut) throw new Error("Extraction timed out");

    const extractedBinary = join(installDir, "build", "avalanchego");
    if (existsSync(extractedBinary)) {
      await Bun.write(binaryPath, Bun.file(extractedBinary));
      await spawnWithTimeout(["rm", "-rf", join(installDir, "build")], { timeoutMs: SPAWN_TIMEOUTS.SHORT });
    }
  } else {
    // Linux: avalanchego-v1.x.x/avalanchego inside the tarball
    const extractResult = await spawnWithTimeout(["tar", "-xzf", archivePath, "-C", installDir], {
      cwd: installDir,
      timeoutMs: SPAWN_TIMEOUTS.EXTRACT,
    });
    if (extractResult.timedOut) throw new Error("Extraction timed out");

    const extractedDir = join(installDir, `avalanchego-${version}`);
    if (existsSync(extractedDir)) {
      const extractedBinary = join(extractedDir, "avalanchego");
      if (existsSync(extractedBinary)) {
        await Bun.write(binaryPath, Bun.file(extractedBinary));
      }
      await spawnWithTimeout(["rm", "-rf", extractedDir], { timeoutMs: SPAWN_TIMEOUTS.SHORT });
    }
  }

  if (existsSync(binaryPath)) {
    chmodSync(binaryPath, 0o755);
  } else {
    throw new Error("Failed to extract avalanchego binary");
  }

  try {
    await spawnWithTimeout(["rm", "-f", archivePath], { timeoutMs: SPAWN_TIMEOUTS.SHORT });
  } catch (error) {
    logger.ignored("cleaning up archive file", error);
  }

  setCachedAvalanchegoPath(binaryPath);
  onProgress?.(`installed ${version}`);

  return binaryPath;
}

/**
 * Locate or download the avalanchego binary.  Order of resolution:
 *   1. `cachedAvalanchegoPath` (if previously set + still exists)
 *   2. `which avalanchego` on PATH
 *   3. Download latest release into `~/.avalanche-cli/bin/<version>/`
 */
export async function ensureAvalanchego(onProgress?: (message: string) => void): Promise<string> {
  if (cachedAvalanchegoPath && existsSync(cachedAvalanchegoPath)) {
    return cachedAvalanchegoPath;
  }

  try {
    const proc = Bun.spawn(["which", "avalanchego"], {
      stdout: "pipe",
      stderr: "pipe",
    });
    await proc.exited;
    const output = await new Response(proc.stdout).text();
    const systemPath = output.trim();
    if (systemPath && existsSync(systemPath)) {
      setCachedAvalanchegoPath(systemPath);
      return systemPath;
    }
  } catch (error) {
    logger.file(`avalanchego not found in PATH: ${error instanceof Error ? error.message : "lookup failed"}`);
  }

  return downloadAvalanchego(onProgress);
}

export function getInstalledVersion(): string | null {
  if (!cachedAvalanchegoPath || !existsSync(cachedAvalanchegoPath)) return null;
  const match = cachedAvalanchegoPath.match(/v\d+\.\d+\.\d+/);
  return match ? match[0] : null;
}
