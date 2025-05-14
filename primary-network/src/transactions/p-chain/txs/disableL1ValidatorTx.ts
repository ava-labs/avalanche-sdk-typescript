import { pvm, type pvmSerial } from "@avalabs/avalanchejs";
import { Transaction } from "../common/transaction";
import type { CommonTxParams, NewTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type DisableL1ValidatorTxParams = CommonTxParams & {
    validationId: string;
    disableAuth: number[];
}

export class DisableL1ValidatorTx extends Transaction {
    override tx: pvmSerial.DisableL1ValidatorTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.DisableL1ValidatorTx
    }
}

export async function newDisableL1ValidatorTx(
    primaryNetworkCore: PrimaryNetworkCore,
    params: DisableL1ValidatorTxParams,
): Promise<DisableL1ValidatorTx> {
    const context = await primaryNetworkCore.initializeContextIfNot()
    const commonTxParams = await fetchCommonTxParams(params, context, primaryNetworkCore.pvmRpc, primaryNetworkCore.wallet)

    const unsignedTx = pvm.newDisableL1ValidatorTx({
        ...commonTxParams,
        validationId: params.validationId,
        disableAuth: params.disableAuth,
    }, context)

    return new DisableL1ValidatorTx({
        unsignedTx,
        pvmRpc: primaryNetworkCore.pvmRpc,
        nodeUrl: primaryNetworkCore.nodeUrl,
        wallet: primaryNetworkCore.wallet,
    })
}
