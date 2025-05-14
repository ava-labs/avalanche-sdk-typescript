import { pvm, utils, type pvmSerial } from "@avalabs/avalanchejs";
import { Transaction } from "../common/transaction";
import type { CommonTxParams, NewTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";
import type { PrimaryNetworkCore } from "../../../primaryNetworkCoreClient";

export type SetL1ValidatorWeightTxParams = CommonTxParams & {
    message: string;
}

export class SetL1ValidatorWeightTx extends Transaction {
    override tx: pvmSerial.SetL1ValidatorWeightTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.SetL1ValidatorWeightTx
    }
}

export async function newSetL1ValidatorWeightTx(
    primaryNetworkCore: PrimaryNetworkCore,
    params: SetL1ValidatorWeightTxParams,
): Promise<SetL1ValidatorWeightTx> {
    const context = await primaryNetworkCore.initializeContextIfNot()
    const commonTxParams = await fetchCommonTxParams(params, context, primaryNetworkCore.pvmRpc, primaryNetworkCore.wallet)

    const unsignedTx = pvm.newSetL1ValidatorWeightTx({
        ...commonTxParams,
        message: utils.hexToBuffer(params.message),
    }, context)

    return new SetL1ValidatorWeightTx({
        unsignedTx,
        pvmRpc: primaryNetworkCore.pvmRpc,
        nodeUrl: primaryNetworkCore.nodeUrl,
        wallet: primaryNetworkCore.wallet,
    })
}
