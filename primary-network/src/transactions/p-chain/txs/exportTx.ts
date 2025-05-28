import { pvm, type pvmSerial } from "@avalabs/avalanchejs";
import { Transaction } from "../common/transaction";
import { fetchCommonTxParams, formatOutput, getChainIdFromAlias } from "../common/utils";
import type { CommonTxParams, NewTxParams, Output } from "../common/types";
import type { X_CHAIN_ALIAS, C_CHAIN_ALIAS, P_CHAIN_ALIAS } from "../common/consts";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type ExportTxParams = CommonTxParams & {
    destinationChain: typeof X_CHAIN_ALIAS | typeof C_CHAIN_ALIAS | typeof P_CHAIN_ALIAS;
    exportedOutputs: Output[];
}

export class ExportTx extends Transaction {
    override tx: pvmSerial.ExportTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.ExportTx
    }
}

export async function newExportTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    txPrams: ExportTxParams,
): Promise<ExportTx> {
    const context = await primaryNetworkCoreClient.initializeContextIfNot()
    const { commonTxParams } = await fetchCommonTxParams(txPrams, context, primaryNetworkCoreClient.pvmRpc, primaryNetworkCoreClient.wallet)

    const exportedOutputs = txPrams.exportedOutputs.map(output => formatOutput(output, context))

    const unsignedTx = pvm.newExportTx(
        {
            ...commonTxParams,
            outputs: exportedOutputs,
            destinationChainId: getChainIdFromAlias(txPrams.destinationChain, context.networkID),
        },
        context,
    );

    return new ExportTx({
        unsignedTx,
        pvmRpc: primaryNetworkCoreClient.pvmRpc,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        wallet: primaryNetworkCoreClient.wallet,
    })
}