import { RpcSchemaOverride } from "viem";
import { BaseFeeMethod } from "../public/types/baseFee.js";
import { GetChainConfigMethod } from "../public/types/getChainConfig.js";
import { MaxPriorityFeePerGasMethod } from "../public/types/maxPriorityFeePerGas.js";
import { GetAtomicTxMethod } from "./types/getAtomicTx.js";
import { GetAtomicTxStatusMethod } from "./types/getAtomicTxStatus.js";
import { GetUTXOsMethod } from "./types/getUTXOs.js";
import { IssueTxMethod } from "./types/issueTx.js";

export type CChainMethods = [
  BaseFeeMethod,
  GetChainConfigMethod,
  MaxPriorityFeePerGasMethod,
  GetAtomicTxMethod,
  GetAtomicTxStatusMethod,
  GetUTXOsMethod,
  IssueTxMethod
];

/**
 * The RPC schema for the C-Chain methods.
 *
 * @see {@link CChainMethods}
 */
export type CChainRpcSchema = RpcSchemaOverride & CChainMethods;
