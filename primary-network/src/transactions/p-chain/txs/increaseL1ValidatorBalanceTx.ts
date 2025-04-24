import {
    type Context as ContextType,
    pvm,
} from "@avalabs/avalanchejs";
import type { Wallet } from "../../../wallet";
import { Transaction } from "../common/transaction";
import type { CommonTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";

export type IncreaseL1ValidatorBalanceTxParams = CommonTxParams & {
    balanceInAVAX: number;
    validationId: string;
}

export class IncreaseL1ValidatorBalanceTx extends Transaction {}

export async function newIncreaseL1ValidatorBalanceTx(
    params: IncreaseL1ValidatorBalanceTxParams,
    context: ContextType.Context,
    pvmRpc: pvm.PVMApi,
    nodeUrl: string,
    wallet?: Wallet,
): Promise<IncreaseL1ValidatorBalanceTx> {
    const commonTxParams = await fetchCommonTxParams(params, context, pvmRpc, wallet)

    const unsignedTx = pvm.newIncreaseL1ValidatorBalanceTx({
        ...commonTxParams,
        balance: BigInt(params.balanceInAVAX * 1e9),
        validationId: params.validationId,
    }, context)
    return new IncreaseL1ValidatorBalanceTx({ unsignedTx, pvmRpc, nodeUrl, wallet })
}
