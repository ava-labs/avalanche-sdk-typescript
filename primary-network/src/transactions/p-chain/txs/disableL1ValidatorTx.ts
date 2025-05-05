import {
    type Context as ContextType,
    pvm,
    type pvmSerial,
} from "@avalabs/avalanchejs";
import type { Wallet } from "../../../wallet";
import { Transaction } from "../common/transaction";
import type { CommonTxParams, NewTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";

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
    params: DisableL1ValidatorTxParams,
    context: ContextType.Context,
    pvmRpc: pvm.PVMApi,
    nodeUrl: string,
    wallet?: Wallet,
): Promise<DisableL1ValidatorTx> {
    const commonTxParams = await fetchCommonTxParams(params, context, pvmRpc, wallet)

    const unsignedTx = pvm.newDisableL1ValidatorTx({
        ...commonTxParams,
        validationId: params.validationId,
        disableAuth: params.disableAuth,
    }, context)
    return new DisableL1ValidatorTx({ unsignedTx, pvmRpc, nodeUrl, wallet })
}
