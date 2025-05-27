import { pvm, type pvmSerial } from "@avalabs/avalanchejs";
import { Transaction } from "../common/transaction";
import { fetchCommonTxParams } from "../common/utils";
import type { CommonTxParams, NewTxParams } from "../common/types";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type BaseTxParams = CommonTxParams

export class BaseTx extends Transaction {
    override tx: pvmSerial.BaseTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.BaseTx
    }
}

export async function newBaseTx(
    primaryNetworkCoreClient: PrimaryNetworkCore,
    txPrams: BaseTxParams,
): Promise<BaseTx> {
    const context = await primaryNetworkCoreClient.initializeContextIfNot()
    const { commonTxParams } = await fetchCommonTxParams(
        txPrams,
        context,
        primaryNetworkCoreClient.pvmRpc,
        primaryNetworkCoreClient.wallet,
    )

    const unsignedTx = pvm.newBaseTx(
        commonTxParams,
        context,
    );

    return new BaseTx({
        unsignedTx,
        wallet: primaryNetworkCoreClient.wallet,
        nodeUrl: primaryNetworkCoreClient.nodeUrl,
        pvmRpc: primaryNetworkCoreClient.pvmRpc,
    })
}