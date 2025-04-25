import { type Context as ContextType, pvm } from "@avalabs/avalanchejs";
import type { Wallet } from "../../../wallet";
import { Transaction } from "../common/transaction";
import type { CommonTxParams } from "../common/types";
import { fetchCommonTxParams } from "../common/utils";

export type AddSubnetValidatorTxParams = CommonTxParams & {
    subnetId: string;
    nodeId: string;
    weight: bigint;
    end: bigint;
    subnetAuth: readonly number[];
}

export class AddSubnetValidatorTx extends Transaction {}

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
