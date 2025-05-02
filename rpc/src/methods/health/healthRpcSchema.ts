import { RpcSchemaOverride } from "viem";
import { HealthMethod } from "./types/health.js";
import { LivenessMethod } from "./types/liveness.js";
import { ReadinessMethod } from "./types/readiness.js";
export type HealthMethods = [LivenessMethod, ReadinessMethod, HealthMethod];

export type HealthRpcSchema = RpcSchemaOverride & HealthMethods;
