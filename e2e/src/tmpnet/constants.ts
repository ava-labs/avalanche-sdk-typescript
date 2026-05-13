/**
 * Tmpnet Constants
 *
 * Paths, ports, and pre-funded keys used by the local tmpnet driver.
 * Ported verbatim from avalanche-ai.
 */

import { join } from "path";

/**
 * Root directory for tmpnet (matches avalanche-cli's layout).
 */
export const TMPNET_ROOT = join(process.env.HOME || "/tmp", ".avalanche-cli", "tmpnet");

/** Directory containing all named networks. */
export const NETWORKS_DIR = join(TMPNET_ROOT, "networks");

/** Default staking keys directory. */
export const STAKING_KEYS_DIR = join(process.env.HOME || "", ".avalanche-cli", "staking", "local");

/** Default plugin directory. */
export const PLUGIN_DIR = join(process.env.HOME || "", ".avalanchego", "plugins");

/** Pre-funded keys for local network (from avalanchego genesis). */
export const LOCAL_PREFUNDED_KEYS = {
  ewoq: {
    privateKey: "56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027",
    privateKeyFormatted: "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN",
    cChainAddress: "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC",
  },
};

/**
 * Ports used by tmpnet nodes.
 * Node 0: 9650 (http), 9651 (staking)
 * Node 1: 9750 (http), 9751 (staking)
 * ...
 */
export const BASE_HTTP_PORT = 9650;
export const PORT_INCREMENT = 100;

/** All ports that might be used by tmpnet (for cleanup). */
export const TMPNET_PORTS = [9650, 9750, 9850, 9950, 10050, 10150, 10250, 10350];

/** Maximum number of pre-configured stakers (with stored keys). */
export const MAX_PRECONFIGURED_STAKERS = 5;

/** Default timeouts (ms / attempt counts). */
export const NODE_HEALTH_CHECK_INTERVAL = 200;
export const NODE_HEALTH_TIMEOUT = 2000;
export const NODE_QUICK_HEALTH_TIMEOUT = 500;
export const NODE_STARTUP_TIMEOUT = 300;
export const NODE_PARALLEL_STARTUP_TIMEOUT = 150;
export const L1_NODE_STARTUP_TIMEOUT = 150;
export const PROCESS_KILL_WAIT = 500;
export const NODE_RESTART_WAIT = 1000;
