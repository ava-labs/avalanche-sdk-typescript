import { avm, type avmSerial } from "@avalabs/avalanchejs";
import { Transaction } from "../common/transaction";
import { fetchCommonAvmTxParams, formatOutput, getChainIdFromAlias, toTransferableOutput } from "../../common/utils";
import type { CommonTxParams, NewTxParams, Output } from "../../common/types";
import type { P_CHAIN_ALIAS, C_CHAIN_ALIAS } from "../../common/consts";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";


export type ExportTxParams = CommonTxParams & {
    /**
     * The chain to export the funds to.
     */
    destinationChain: typeof P_CHAIN_ALIAS | typeof C_CHAIN_ALIAS;
    /**
     * The outputs to export.
     */
    exportedOutputs: Output[];
}

export class ExportTx extends Transaction {
    override tx: avmSerial.ExportTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as avmSerial.ExportTx
    }

    getExportedOutputs() {
        const transferableOutputs = this.tx.outs
        return transferableOutputs.map(toTransferableOutput)
    }
}

export async function newExportTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    txPrams: ExportTxParams,
): Promise<ExportTx> {
    // added -avmRpc: avm.AVMApi- feild to primaryNetworkCoreClient
    const context = await primaryNetworkCoreClient.initializeContextIfNot()
    const { commonTxParams } = await fetchCommonAvmTxParams(txPrams, context, primaryNetworkCoreClient.avmRpc, primaryNetworkCoreClient.wallet)

    const exportedOutputs = txPrams.exportedOutputs.map(output => formatOutput(output, context))

    const unsignedTx = avm.newExportTx(
        {
            context, 
            destinationChainId: getChainIdFromAlias(txPrams.destinationChain, context.networkID),
            fromAddressesBytes: commonTxParams.fromAddressesBytes,
            utxoSet: commonTxParams.utxoSet,
            outputs: exportedOutputs,
        },
        context,
    );

    return new ExportTx({
        unsignedTx,
        rpc: primaryNetworkCoreClient.avmRpc,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        wallet: primaryNetworkCoreClient.wallet,
    })
}

