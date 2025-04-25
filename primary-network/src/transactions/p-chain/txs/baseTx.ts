import { pvm, type Context as ContextType } from "@avalabs/avalanchejs";
import type { Wallet } from "../../../wallet";
import { Transaction } from "../common/transaction";
import { fetchCommonTxParams } from "../common/utils";
import type { CommonTxParams } from "../common/types";

export type BaseTxParams = CommonTxParams

export class BaseTx extends Transaction {}

export async function newBaseTx(
    txPrams: BaseTxParams,
    context: ContextType.Context,
    pvmRpc: pvm.PVMApi,
    nodeUrl: string,
    wallet?: Wallet,
): Promise<BaseTx> {
    const commonTxParams = await fetchCommonTxParams(txPrams, context, pvmRpc, wallet)

    const unsignedTx = pvm.newBaseTx(
        commonTxParams,
        context,
    );

    return new BaseTx({
        unsignedTx,
        wallet,
        nodeUrl,
        pvmRpc,
    })
}