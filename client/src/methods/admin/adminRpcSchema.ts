import { RpcSchemaOverride } from "viem";
import { AliasMethod } from "./types/alias.js";
import { AliasChainMethod } from "./types/aliasChain.js";
import { GetChainAliasesMethod } from "./types/getChainAliases.js";
import { GetLoggerLevelMethod } from "./types/getLoggerLevel.js";
import { LoadVMsMethod } from "./types/loadVMs.js";
import { LockProfileMethod } from "./types/lockProfile.js";
import { MemoryProfileMethod } from "./types/memoryProfile.js";
import { SetLoggerLevelMethod } from "./types/setLoggerLevel.js";
import { StartCPUProfilerMethod } from "./types/startCPUProfiler.js";
import { StopCPUProfilerMethod } from "./types/stopCPUProfiler.js";

export type AdminMethods = [
  AliasMethod,
  AliasChainMethod,
  GetChainAliasesMethod,
  GetLoggerLevelMethod,
  LoadVMsMethod,
  LockProfileMethod,
  MemoryProfileMethod,
  SetLoggerLevelMethod,
  StartCPUProfilerMethod,
  StopCPUProfilerMethod
];

/**
 * The RPC schema for the Admin methods.
 *
 * @see {@link AdminMethods}
 */
export type AdminRpcSchema = RpcSchemaOverride & AdminMethods;
