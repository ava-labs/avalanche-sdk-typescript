import { RpcSchemaOverride } from "viem";
import { BaseFeeMethod } from "./types/baseFee.js";
import { GetChainConfigMethod } from "./types/getChainConfig.js";
import { MaxPriorityFeePerGasMethod } from "./types/maxPriorityFeePerGas.js";
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
    IssueTxMethod,
];

export type CChainRpcSchema = RpcSchemaOverride & CChainMethods;

