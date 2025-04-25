import { Chain, Transport } from "viem";
import { AvalancheCoreClient } from "../createAvalancheCoreClient.js";
import { BaseFeeReturnType } from "../../methods/cChain/types/baseFee.js";
import { GetAtomicTxParameters, GetAtomicTxReturnType } from "../../methods/cChain/types/getAtomicTx.js";
import { GetAtomicTxStatusParameters, GetAtomicTxStatusReturnType } from "../../methods/cChain/types/getAtomicTxStatus.js";
import { GetChainConfigReturnType } from "../../methods/cChain/types/getChainConfig.js";
import { GetUTXOsReturnType, GetUTXOsParameters } from "../../methods/cChain/types/getUTXOs.js";
import { IssueTxReturnType, IssueTxParameters } from "../../methods/cChain/types/issueTx.js";
import { baseFee } from "../../methods/cChain/baseFee.js";
import { getAtomicTx } from "../../methods/cChain/getAtomicTx.js";
import { getAtomicTxStatus } from "../../methods/cChain/getAtomicTxStatus.js";
import { getChainConfig } from "../../methods/cChain/getChainConfig.js";
import { getUTXOs } from "../../methods/cChain/getUTXOs.js";
import { issueTx } from "../../methods/cChain/issueTx.js";
import { MaxPriorityFeePerGasReturnType } from "../../methods/cChain/types/maxPriorityFeePerGas.js";
import { maxPriorityFeePerGas } from "../../methods/cChain/maxPriorityFeePerGas.js";

export type CChainActions = {
    baseFee: () => Promise<BaseFeeReturnType>;
    getAtomicTx: (args: GetAtomicTxParameters) => Promise<GetAtomicTxReturnType>;
    getAtomicTxStatus: (args: GetAtomicTxStatusParameters) => Promise<GetAtomicTxStatusReturnType>;
    getChainConfig: () => Promise<GetChainConfigReturnType>;
    getUTXOs: (args: GetUTXOsParameters) => Promise<GetUTXOsReturnType>;
    issueTx: (args: IssueTxParameters) => Promise<IssueTxReturnType>;
    maxPriorityFeePerGas: () => Promise<MaxPriorityFeePerGasReturnType>;
};

export function cChainActions<
  chain extends Chain | undefined = Chain | undefined
>(client: AvalancheCoreClient<Transport, chain>): CChainActions {
  return {
    baseFee: () => baseFee(client),
    getAtomicTx: (args) => getAtomicTx(client, args),
    getAtomicTxStatus: (args) => getAtomicTxStatus(client, args),
    getChainConfig: () => getChainConfig(client),
    getUTXOs: (args) => getUTXOs(client, args),
    issueTx: (args) => issueTx(client, args),
    maxPriorityFeePerGas: () => maxPriorityFeePerGas(client),
  };
}