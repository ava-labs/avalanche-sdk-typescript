import { RpcSchemaOverride } from "viem";
import { PChainMethods } from "./pchain/pChainRpcSchema.js";

export type AvalancheRpcSchema = RpcSchemaOverride & PChainMethods;

