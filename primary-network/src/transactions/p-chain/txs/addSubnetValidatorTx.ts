import { type Context as ContextType, pvm, type pvmSerial } from "@avalabs/avalanchejs";
import type { Wallet } from "../../../wallet";
import { Transaction } from "../common/transaction";
import type { CommonTxParams, NewTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";

export type AddSubnetValidatorTxParams = CommonTxParams & {
    subnetId: string;
    nodeId: string;
    weight: bigint;
    end: bigint;
    subnetAuth: readonly number[];
}

export class AddSubnetValidatorTx extends Transaction {
    override tx: pvmSerial.AddSubnetValidatorTx;

    constructor(params: NewTxParams) {
        super(params)
        this.tx = params.unsignedTx.getTx() as pvmSerial.AddSubnetValidatorTx
    }
}

export async function newAddSubnetValidatorTx(
    params: AddSubnetValidatorTxParams,
    context: ContextType.Context,
    pvmRpc: pvm.PVMApi,
    nodeUrl: string,
    wallet?: Wallet,
): Promise<AddSubnetValidatorTx> {
    const commonTxParams = await fetchCommonTxParams(params, context, pvmRpc, wallet)

    const unsignedTx = pvm.newAddSubnetValidatorTx({
        ...commonTxParams,
        subnetId: params.subnetId,
        nodeId: params.nodeId,
        weight: params.weight,
        start: 0n, // start time is not relevant after Durango upgrade
        end: params.end,
        subnetAuth: params.subnetAuth,
    }, context)
    return new AddSubnetValidatorTx({ unsignedTx, pvmRpc, nodeUrl, wallet })
}
