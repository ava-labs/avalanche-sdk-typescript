import { RpcSchemaOverride } from "viem";
import { BaseFeeMethod } from "./types/baseFee.js";
import { GetChainConfigMethod } from "./types/getChainConfig.js";
import { MaxPriorityFeePerGasMethod } from "./types/maxPriorityFeePerGas.js";

export type AvalanchePublicMethods = [
  BaseFeeMethod,
  GetChainConfigMethod,
  MaxPriorityFeePerGasMethod
];

export type AvalanchePublicRpcSchema = RpcSchemaOverride &
  AvalanchePublicMethods;
