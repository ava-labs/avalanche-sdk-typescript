import { Chain, Transport } from "viem";
import { alias } from "../../methods/admin/alias.js";
import { aliasChain } from "../../methods/admin/aliasChain.js";
import { getChainAliases } from "../../methods/admin/getChainAliases.js";
import { getLoggerLevel } from "../../methods/admin/getLoggerLevel.js";
import { loadVMs } from "../../methods/admin/loadVMs.js";
import { lockProfile } from "../../methods/admin/lockProfile.js";
import { memoryProfile } from "../../methods/admin/memoryProfile.js";
import { setLoggerLevel } from "../../methods/admin/setLoggerLevel.js";
import { startCPUProfiler } from "../../methods/admin/startCPUProfiler.js";
import { stopCPUProfiler } from "../../methods/admin/stopCPUProfiler.js";
import { AliasParameters } from "../../methods/admin/types/alias.js";
import { AliasChainParameters } from "../../methods/admin/types/aliasChain.js";
import {
  GetChainAliasesParameters,
  GetChainAliasesReturnType,
} from "../../methods/admin/types/getChainAliases.js";
import {
  GetLoggerLevelParameters,
  GetLoggerLevelReturnType,
} from "../../methods/admin/types/getLoggerLevel.js";
import { LoadVMsReturnType } from "../../methods/admin/types/loadVMs.js";
import { SetLoggerLevelParameters } from "../../methods/admin/types/setLoggerLevel.js";
import { AvalancheCoreClient } from "../createAvalancheCoreClient.js";

export type AdminAPIActions = {
  /**
   * Assign an API endpoint an alias, a different endpoint for the API.
   * The original endpoint will still work. This change only affects this node.
   *
   * - Docs: https://build.avax.network/docs/api-reference/admin-api#adminalias
   *
   * @param args - {@link AliasParameters}
   * @returns Promise that resolves when the alias is set
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * await client.admin.alias({
   *   endpoint: "bc/X",
   *   alias: "myAlias"
   * })
   * ```
   */
  alias: (args: AliasParameters) => Promise<void>;

  /**
   * Give a blockchain an alias, a different name that can be used any place the blockchain's ID is used.
   * Note: The alias is set for each chain on each node individually.
   *
   * - Docs: https://build.avax.network/docs/api-reference/admin-api#adminaliaschain
   *
   * @param args - {@link AliasChainParameters}
   * @returns Promise that resolves when the chain alias is set
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * await client.admin.aliasChain({
   *   chain: "sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM",
   *   alias: "myBlockchainAlias"
   * })
   * ```
   */
  aliasChain: (args: AliasChainParameters) => Promise<void>;

  /**
   * Returns the aliases of the chain.
   *
   * - Docs: https://build.avax.network/docs/api-reference/admin-api#admingetchainaliases
   *
   * @param args - {@link GetChainAliasesParameters}
   * @returns The aliases of the chain. {@link GetChainAliasesReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const aliases = await client.admin.getChainAliases({
   *   chain: "sV6o671RtkGBcno1FiaDbVcFv2sG5aVXMZYzKdP4VQAWmJQnM"
   * })
   * ```
   */
  getChainAliases: (
    args: GetChainAliasesParameters
  ) => Promise<GetChainAliasesReturnType>;

  /**
   * Returns log and display levels of loggers.
   *
   * - Docs: https://build.avax.network/docs/api-reference/admin-api#admingetloggerlevel
   *
   * @param args - {@link GetLoggerLevelParameters}
   * @returns The log and display levels of loggers. {@link GetLoggerLevelReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const loggerLevels = await client.admin.getLoggerLevel({
   *   loggerName: "C"
   * })
   * ```
   */
  getLoggerLevel: (
    args: GetLoggerLevelParameters
  ) => Promise<GetLoggerLevelReturnType>;

  /**
   * Dynamically loads any virtual machines installed on the node as plugins.
   *
   * - Docs: https://build.avax.network/docs/api-reference/admin-api#adminloadvms
   *
   * @returns The virtual machines installed on the node. {@link LoadVMsReturnType}
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * const vms = await client.admin.loadVMs()
   * ```
   */
  loadVMs: () => Promise<LoadVMsReturnType>;

  /**
   * Writes a profile of mutex statistics to `lock.profile`.
   *
   * - Docs: https://build.avax.network/docs/api-reference/admin-api#adminlockprofile
   *
   * @returns Promise that resolves when the profile is written
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * await client.admin.lockProfile()
   * ```
   */
  lockProfile: () => Promise<void>;

  /**
   * Writes a memory profile of the node to `mem.profile`.
   *
   * - Docs: https://build.avax.network/docs/api-reference/admin-api#adminmemoryprofile
   *
   * @returns Promise that resolves when the profile is written
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * await client.admin.memoryProfile()
   * ```
   */
  memoryProfile: () => Promise<void>;

  /**
   * Sets log and display levels of loggers.
   *
   * - Docs: https://build.avax.network/docs/api-reference/admin-api#adminsetloggerlevel
   *
   * @param args - {@link SetLoggerLevelParameters}
   * @returns Promise that resolves when the logger levels are set
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * await client.admin.setLoggerLevel({
   *   loggerName: "C",
   *   logLevel: "DEBUG",
   *   displayLevel: "INFO"
   * })
   * ```
   */
  setLoggerLevel: (args: SetLoggerLevelParameters) => Promise<void>;

  /**
   * Start profiling the CPU utilization of the node.
   * To stop, call `stopCPUProfiler`. On stop, writes the profile to `cpu.profile`.
   *
   * - Docs: https://build.avax.network/docs/api-reference/admin-api#adminstartcpuprofiler
   *
   * @returns Promise that resolves when the profiler is started
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * await client.admin.startCPUProfiler()
   * ```
   */
  startCPUProfiler: () => Promise<void>;

  /**
   * Stop the CPU profile that was previously started.
   *
   * - Docs: https://build.avax.network/docs/api-reference/admin-api#adminstopcpuprofiler
   *
   * @returns Promise that resolves when the profiler is stopped
   *
   * @example
   * ```ts
   * import { createAvalancheClient} from '@avalanche-sdk/client'
   * import { avalanche } from '@avalanche-sdk/client/chains'
   *
   * const client = createAvalancheClient({
   *   chain: avalanche,
   *   transport: {
   *     type: "http",
   *   },
   * })
   *
   * await client.admin.stopCPUProfiler()
   * ```
   */
  stopCPUProfiler: () => Promise<void>;
};

export function adminAPIActions<
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheCoreClient<Transport, chain>): AdminAPIActions {
  return {
    alias: (args) => alias(client, args),
    aliasChain: (args) => aliasChain(client, args),
    getChainAliases: (args) => getChainAliases(client, args),
    getLoggerLevel: (args) => getLoggerLevel(client, args),
    loadVMs: () => loadVMs(client),
    lockProfile: () => lockProfile(client),
    memoryProfile: () => memoryProfile(client),
    setLoggerLevel: (args) => setLoggerLevel(client, args),
    startCPUProfiler: () => startCPUProfiler(client),
    stopCPUProfiler: () => stopCPUProfiler(client),
  };
}
