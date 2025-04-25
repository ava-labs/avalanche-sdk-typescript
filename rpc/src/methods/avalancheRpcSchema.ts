import { RpcSchemaOverride } from "viem";
import { PChainMethods } from "./pChain/pChainRpcSchema.js";

export type AvalancheRpcSchema = RpcSchemaOverride & PChainMethods;

