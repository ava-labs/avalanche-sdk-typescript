import { RpcSchemaOverride } from "viem";
import { GetCurrentEpochMethod } from "./types/getCurrentEpoch.js";
import { GetProposedHeightMethod } from "./types/getProposedHeight.js";

export type ProposerVMMethods = [
  GetProposedHeightMethod,
  GetCurrentEpochMethod
];

/**
 * The RPC schema for the ProposerVM methods.
 *
 * @see {@link ProposerVMMethods}
 */
export type ProposerVMRpcSchema = RpcSchemaOverride & ProposerVMMethods;
