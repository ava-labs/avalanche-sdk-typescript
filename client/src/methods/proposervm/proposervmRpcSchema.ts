import { RpcSchemaOverride } from "viem";
import { GetCurrentEpochMethod } from "./types/getCurrentEpoch.js";
import { GetProposedHeightMethod } from "./types/getProposedHeight.js";

export type ProposervmMethods = [
  GetProposedHeightMethod,
  GetCurrentEpochMethod
];

/**
 * The RPC schema for the proposervm methods.
 *
 * @see {@link ProposervmMethods}
 */
export type ProposervmRpcSchema = RpcSchemaOverride & ProposervmMethods;
