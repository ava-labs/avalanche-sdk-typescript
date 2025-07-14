import { avm, type avmSerial } from "@avalabs/avalanchejs";
import { Transaction } from "../common/transaction";
import { fetchCommonAvmTxParams, formatOutput } from "../../common/utils";
import type { CommonTxParams, NewTxParams, Output } from "../../common/types";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type BaseTxParams = CommonTxParams & {
    /**
     * Optional. Outputs to send funds to. It can
     * be used to specify resulting UTXOs.
     */
    outputs?: Output[],
}

export class BaseTx extends Transaction {
    override tx: avmSerial.BaseTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as avmSerial.BaseTx
    }
}

export async function newBaseTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    txParams: BaseTxParams,
): Promise<BaseTx> {
    const context = await primaryNetworkCoreClient.initializeContextIfNot()

    // Format outputs as per AvalancheJS
    const formattedOutputs = txParams.outputs ? txParams.outputs.map(output => formatOutput(output, context)) : []

    const { commonTxParams } = await fetchCommonAvmTxParams(
        txParams,
        context,
        primaryNetworkCoreClient.avmRpc,
        primaryNetworkCoreClient.wallet,
    )

    const unsignedTx = avm.newBaseTx(
        context,
        commonTxParams.fromAddressesBytes,
        commonTxParams.utxoSet,
        formattedOutputs,
        {
            ...(commonTxParams.changeAddressesBytes && { changeAddresses: commonTxParams.changeAddressesBytes }),
            ...(commonTxParams.minIssuanceTime && { minIssuanceTime: commonTxParams.minIssuanceTime }),
            ...(commonTxParams.memo && { memo: commonTxParams.memo }),
        },
    );

    return new BaseTx({
        unsignedTx,
        wallet: primaryNetworkCoreClient.wallet,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        rpc: primaryNetworkCoreClient.avmRpc,
    })
}