import { RpcSchemaOverride } from "viem";
import { BaseFeeMethod } from "./types/baseFee.js";
import { FeeConfigMethod } from "./types/feeConfig.js";
import { GetActiveRulesAtMethod } from "./types/getActiveRulesAt.js";
import { GetChainConfigMethod } from "./types/getChainConfig.js";
import { MaxPriorityFeePerGasMethod } from "./types/maxPriorityFeePerGas.js";

export type AvalanchePublicMethods = [
  BaseFeeMethod,
  GetChainConfigMethod,
  MaxPriorityFeePerGasMethod,
  FeeConfigMethod,
  GetActiveRulesAtMethod
];

/**
 * The RPC schema for the Avalanche Public methods.
 *
 * @see {@link AvalanchePublicMethods}
 */
export type AvalanchePublicRpcSchema = RpcSchemaOverride &
  AvalanchePublicMethods;
