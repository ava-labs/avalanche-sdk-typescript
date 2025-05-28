import { pvm, type pvmSerial } from "@avalabs/avalanchejs";
import { Transaction } from "../common/transaction";
import { fetchCommonTxParams, formatOutput } from "../common/utils";
import type { CommonTxParams, NewTxParams, Output } from "../common/types";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type BaseTxParams = CommonTxParams & {
    /**
     * Optional. Outputs to send funds to. It can
     * be used to specify resulting UTXOs.
     */
    outputs?: Output[],
}

export class BaseTx extends Transaction {
    override tx: pvmSerial.BaseTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.BaseTx
    }
}

export async function newBaseTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    txParams: BaseTxParams,
): Promise<BaseTx> {
    const context = await primaryNetworkCoreClient.initializeContextIfNot()

    // Format outputs as per AvalancheJS
    const formattedOutputs = txParams.outputs ? txParams.outputs.map(output => formatOutput(output, context)) : []

    const { commonTxParams } = await fetchCommonTxParams(
        txParams,
        context,
        primaryNetworkCoreClient.pvmRpc,
        primaryNetworkCoreClient.wallet,
    )

    const unsignedTx = pvm.newBaseTx(
        {
            ...commonTxParams,
            outputs: formattedOutputs,
        },
        context,
    );

    return new BaseTx({
        unsignedTx,
        wallet: primaryNetworkCoreClient.wallet,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        pvmRpc: primaryNetworkCoreClient.pvmRpc,
    })
}