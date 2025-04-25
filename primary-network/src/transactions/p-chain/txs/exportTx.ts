import { pvm, type Context as ContextType } from "@avalabs/avalanchejs";
import type { Wallet } from "../../../wallet";
import { Transaction } from "../common/transaction";
import { fetchCommonTxParams, formatOutput, getChainIdFromAlias } from "../common/utils";
import type { CommonTxParams, Output } from "../common/types";
import type { X_CHAIN_ALIAS, C_CHAIN_ALIAS, P_CHAIN_ALIAS } from "../common/consts";

export type ExportTxParams = CommonTxParams & {
    destinationChain: typeof X_CHAIN_ALIAS | typeof C_CHAIN_ALIAS | typeof P_CHAIN_ALIAS;
    exportedOutputs: Output[];
}

export class ExportTx extends Transaction {}

export async function newExportTx(
    txPrams: ExportTxParams,
    context: ContextType.Context,
    pvmRpc: pvm.PVMApi,
    nodeUrl: string,
    wallet?: Wallet,
): Promise<ExportTx> {
    const commonTxParams = await fetchCommonTxParams(txPrams, context, pvmRpc, wallet)

    const exportedOutputs = txPrams.exportedOutputs.map(output => formatOutput(output, context))
    commonTxParams.outputs = [...commonTxParams.outputs, ...exportedOutputs]

    const unsignedTx = pvm.newExportTx(
        {
            ...commonTxParams,
            destinationChainId: 'yH8D7ThNJkxmtkuv2jgBa4P1Rn3Qpr4pPr7QYNfcdoS6k6HWp',
        },
        context,
    );

    return new ExportTx({
        unsignedTx,
        wallet,
        nodeUrl,
        pvmRpc,
    })
}