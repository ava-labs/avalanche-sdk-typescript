import { RpcSchemaOverride } from "viem";
import { LivenessMethod } from "./types/liveness.js";
import { ReadinessMethod } from "./types/readiness.js";
import { HealthMethod } from "./types/health.js";
export type HealthMethods = [LivenessMethod, ReadinessMethod, HealthMethod];

export type HealthRpcSchema = RpcSchemaOverride & HealthMethods;
