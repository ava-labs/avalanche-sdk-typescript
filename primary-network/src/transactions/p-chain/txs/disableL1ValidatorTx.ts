import {
    type Context as ContextType,
    pvm,
} from "@avalabs/avalanchejs";
import type { Wallet } from "../../../wallet";
import { Transaction } from "../common/transaction";
import type { CommonTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";

export type DisableL1ValidatorTxParams = CommonTxParams & {
    validationId: string;
    disableAuth: number[];
}

export class DisableL1ValidatorTx extends Transaction {}

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
