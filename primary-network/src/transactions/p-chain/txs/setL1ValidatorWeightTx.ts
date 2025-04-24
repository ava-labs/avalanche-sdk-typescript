import {
    type Context as ContextType,
    pvm,
    utils
} from "@avalabs/avalanchejs";
import type { Wallet } from "../../../wallet";
import { Transaction } from "../common/transaction";
import type { CommonTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";

export type SetL1ValidatorWeightTxParams = CommonTxParams & {
    message: string;
}

export class SetL1ValidatorWeightTx extends Transaction {}

export async function newSetL1ValidatorWeightTx(
    params: SetL1ValidatorWeightTxParams,
    context: ContextType.Context,
    pvmRpc: pvm.PVMApi,
    nodeUrl: string,
    wallet?: Wallet,
): Promise<SetL1ValidatorWeightTx> {
    const commonTxParams = await fetchCommonTxParams(params, context, pvmRpc, wallet)

    const unsignedTx = pvm.newSetL1ValidatorWeightTx({
        ...commonTxParams,
        message: utils.hexToBuffer(params.message),
    }, context)
    return new SetL1ValidatorWeightTx({ unsignedTx, pvmRpc, nodeUrl, wallet })
}
