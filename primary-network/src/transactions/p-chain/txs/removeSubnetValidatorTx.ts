import { type Context as ContextType, pvm, type pvmSerial } from "@avalabs/avalanchejs";
import type { Wallet } from "../../../wallet";
import { Transaction } from "../common/transaction";
import type { CommonTxParams, NewTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";

export type RemoveSubnetValidatorTxParams = CommonTxParams & {
    subnetId: string;
    nodeId: string;
    subnetAuth: readonly number[];
}

export class RemoveSubnetValidatorTx extends Transaction {
    override tx: pvmSerial.RemoveSubnetValidatorTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.RemoveSubnetValidatorTx
    }
}

export async function newRemoveSubnetValidatorTx(
    params: RemoveSubnetValidatorTxParams,
    context: ContextType.Context,
    pvmRpc: pvm.PVMApi,
    nodeUrl: string,
    wallet?: Wallet,
): Promise<RemoveSubnetValidatorTx> {
    const commonTxParams = await fetchCommonTxParams(params, context, pvmRpc, wallet)

    const unsignedTx = pvm.newRemoveSubnetValidatorTx({
        ...commonTxParams,
        subnetId: params.subnetId,
        nodeId: params.nodeId,
        subnetAuth: params.subnetAuth,
    }, context)
    return new RemoveSubnetValidatorTx({ unsignedTx, pvmRpc, nodeUrl, wallet })
}
