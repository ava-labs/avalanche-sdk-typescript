import {
    type Context as ContextType,
    pvm,
    utils
} from "@avalabs/avalanchejs";
import type { Wallet } from "../../../wallet";
import { Transaction } from "../common/transaction";
import type { CommonTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";

export type RegisterL1ValidatorTxParams = CommonTxParams & {
    balance: bigint;
    blsSignature: string;
    message: string;
}

export class RegisterL1ValidatorTx extends Transaction {}

export async function newRegisterL1ValidatorTx(
    params: RegisterL1ValidatorTxParams,
    context: ContextType.Context,
    pvmRpc: pvm.PVMApi,
    nodeUrl: string,
    wallet?: Wallet,
): Promise<RegisterL1ValidatorTx> {
    const commonTxParams = await fetchCommonTxParams(params, context, pvmRpc, wallet)

    const unsignedTx = pvm.newRegisterL1ValidatorTx({
        ...commonTxParams,
        balance: params.balance,
        blsSignature: utils.hexToBuffer(params.blsSignature),
        message: utils.hexToBuffer(params.message),
    }, context)
    return new RegisterL1ValidatorTx({ unsignedTx, pvmRpc, nodeUrl, wallet })
}
