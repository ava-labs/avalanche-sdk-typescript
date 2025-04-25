import { Chain, Transport } from "viem";
import { AvalancheCoreClient } from "../createAvalancheCoreClient.js";
import { alias } from "../../methods/admin/alias.js";
import { aliasChain } from "../../methods/admin/aliasChain.js";
import { getChainAliases } from "../../methods/admin/getChainAliases.js";
import { AliasParameters } from "../../methods/admin/types/alias.js";
import { AliasChainParameters } from "../../methods/admin/types/aliasChain.js";
import { GetChainAliasesParameters, GetChainAliasesReturnType } from "../../methods/admin/types/getChainAliases.js";
import { GetLoggerLevelParameters, GetLoggerLevelReturnType } from "../../methods/admin/types/getLoggerLevel.js";
import { LoadVMsReturnType } from "../../methods/admin/types/loadVMs.js";
import { SetLoggerLevelParameters } from "../../methods/admin/types/setLoggerLevel.js";
import { lockProfile } from "../../methods/admin/lockProfile.js";
import { memoryProfile } from "../../methods/admin/memoryProfile.js";
import { startCPUProfiler } from "../../methods/admin/startCPUProfiler.js";
import { stopCPUProfiler } from "../../methods/admin/stopCPUProfiler.js";
import { getLoggerLevel } from "../../methods/admin/getLoggerLevel.js";
import { loadVMs } from "../../methods/admin/loadVMs.js";
import { setLoggerLevel } from "../../methods/admin/setLoggerLevel.js";

export type AdminAPIActions = {
    alias: (args: AliasParameters) => Promise<void>;
    aliasChain: (args: AliasChainParameters) => Promise<void>;
    getChainAliases: (args: GetChainAliasesParameters) => Promise<GetChainAliasesReturnType>;
    getLoggerLevel: (args: GetLoggerLevelParameters) => Promise<GetLoggerLevelReturnType>;
    loadVMs: () => Promise<LoadVMsReturnType>;
    lockProfile: () => Promise<void>;
    memoryProfile: () => Promise<void>;
    setLoggerLevel: (args: SetLoggerLevelParameters) => Promise<void>;
    startCPUProfiler: () => Promise<void>;
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